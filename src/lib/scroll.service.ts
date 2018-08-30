import { Injectable, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

class Parent {
  nativeElement;
  cacheHeight;
  offsets;
  elements = [];
  that;
  resizeListener : BehaviorSubject<any> = new BehaviorSubject(0);

  constructor(item, that) {
    this.nativeElement = item.options.parent;
    this.cacheHeight = item.options.parent.clientHeight;
    this.elements.push(item);
    this.that = that;
  }

  onResize(h) {
    if (h) {
      for (let i = 0, len = this.elements.length; i < len; i++) {
        this.elements[i].offsets = getOffset(this.elements[i].dom);
      }
      this.that._scrollCalculate(this.nativeElement);
    }
  }

  /*  unsubscribe() {
      this.resizeListener.unsubscribe();
      this.nativeElement.removeEventListener('scroll', this.onScroll);
      this.nativeElement.removeEventListener('resize', this.onResize);
    }

    subscribe() {
      this.resizeListener.subscribe(this.onResize);
      this.nativeElement.addEventListener('scroll', this.onScroll);
      this.nativeElement.addEventListener('resize', this.onResize);
      this.that.parents.push(this);
    }*/
}

function getOffset(elem, parent?) {
  const offsetHeight = elem.offsetHeight,
    offsetWidth = elem.offsetWidth;
  let offsetTop = 0, offsetLeft = 0;
  while (elem && elem !== parent) {
    if (!isNaN(elem.offsetTop)) {
      offsetTop += elem.offsetTop;
    }
    if (!isNaN(elem.offsetLeft)) {
      offsetLeft += elem.offsetLeft;
    }
    if (elem !== parent) {
      elem = elem.offsetParent;
    }
  }
  return {
    offsetTop   : offsetTop,
    offsetRight : offsetWidth + offsetLeft,
    offsetBottom: offsetHeight + offsetTop,
    offsetLeft  : offsetLeft,
    height      : offsetHeight,
    width       : offsetWidth,
  };
}


@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  _timer : any;
  _pageHeight : number;
  _resizeListener : BehaviorSubject<any> = new BehaviorSubject(0);
  _elements : any = [];
  _windowHeight = 0;
  _x = 0;
  _y = 0;
  _renderer;

  //TODO NEW VERSION!
  parents = [];

  defaultOptions = {
    offsetTop         : 50,
    offsetLeft        : 50,
    offsetRight       : 50,
    offsetBottom      : 50,
    beforeView        : 'beforeView',
    inView            : 'inView',
    afterView         : 'afterView',
    animationClass    : 'ff-animation',
    animationDuration : 500,
    parent            : window,
    beforeViewCallBack: () => {
    },
    inViewCallBack    : () => {
    },
    afterViewCallBack : () => {
    },
  };

  constructor(_rendererFactory : RendererFactory2) {
    this._renderer = _rendererFactory.createRenderer(null, null);
    console.log('create scroll service');
  }

  _init() {
    if (!this._timer) {
      this._timer = setInterval(() => {
        if ((!this._pageHeight && this._pageHeight !== 0) || (this._pageHeight !== document.body.clientHeight)) {
          this._pageHeight = document.body.clientHeight;
          this._resizeListener.next(this._pageHeight);
        }
      }, 200);
    }
  }

  _setDefaultOptions(options) {
    options.__proto__ = this.defaultOptions;
    return options;
  }

  _getParentScroll(elem) {
    let scrollTop = 0, scrollLeft = 0;
    while (elem) {
      if (elem.offsetParent) {
        scrollTop += elem.offsetParent.scrollTop;
        scrollLeft += elem.offsetParent.scrollLeft;
      }
      elem = elem.offsetParent;
    }
    return {
      scrollTop,
      scrollLeft
    };
  }

  _getState(item, coords) {
    if (!item.offsets) {
      item.offsets = getOffset(item.dom, item.options.parent);
    }
    let height = 0;
    if (item.options.parent === window) {
      height = item.options.parent.innerHeight;
    } else {
      height = item.options.parent.offsetHeight;
    }
    let newState;
    const scrollBox = this._getParentScroll(item.dom);
    // TODO add functional for check scroll left
    if (coords.y > item.offsets.offsetBottom - item.options.offsetTop - scrollBox.scrollTop) {
      newState = 0;
    } else if (coords.y + height < item.offsets.offsetTop + item.options.offsetBottom - scrollBox.scrollTop) {
      newState = 2;
    } else {
      newState = 1;
    }
    if (newState !== item.state) {
      this._changeState(item, newState);
    }
  }

  _changeState(item, state) {
    item.state = state;
    const cssClasses = [item.options.beforeView, item.options.inView, item.options.afterView];
    const calbacks = [item.options.beforeViewCallBack, item.options.inViewCallBack, item.options.afterViewCallBack];

    for (let i = 0, len = cssClasses.length; i < len; i++) {
      this._renderer.removeClass(item.dom, cssClasses[i]);
    }
    if (cssClasses[state]) {
      this._renderer.addClass(item.dom, cssClasses[state]);
      calbacks[state]();
    }
  }

  _scrollCalculate(parent) {
    let x;
    let y;
    if (parent.nativeElement !== window) {
      x = parent.nativeElement.scrollLeft;
      y = parent.nativeElement.scrollTop;
    } else {
      x = window.pageXOffset;
      y = window.pageYOffset;
    }
    for (let i = 0, len = parent.elements.length; i < len; i++) {
      this._getState(parent.elements[i], { y, x });
    }
  }

  changeOptions(item, options) {
    // this._changeState(item, 3);
    // options = this._setDefaultOptions(options);
    // item.options = options;
    // this._scrollCalculate();
  }

  _createParentElement(item) {
    const that = this;
    const parent = new Parent(item, that);
    this.parents.push(parent);
    parent.nativeElement.addEventListener('scroll', () => {
      this._scrollCalculate(parent);
    }, true);
    return parent;
  }

  subscribe(el, options) {
    options = this._setDefaultOptions(options);
    const item = {
      dom    : el,
      state  : 3,
      options,
      offsets: null
    };
    const len = this.parents.length;
    let parent;
    if (len) {
      for (let i = 0; i < len; i++) {
        if (this.parents[i].nativeElement === item.options.parent) {
          parent = this.parents[i];
          parent.elements.push(item);
          break;
        }
      }
    }
    if (!parent) {
      parent = this._createParentElement(item);
    }
    this._scrollCalculate(parent);

    return item;
  }
}
