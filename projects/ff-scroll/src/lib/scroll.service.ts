// @ts-nocheck
import {ElementRef, Injectable, RendererFactory2} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {options, item} from "./scroll.Interface";
import {Parent} from "./Parent"
import {getOffset} from "./helpers"



@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  _timer: any;
  _pageHeight: number;
  _resizeListener: BehaviorSubject<any> = new BehaviorSubject(0);
  _elements: any = [];
  _windowHeight = 0;
  _x = 0;
  _y = 0;
  _renderer;

  //TODO NEW VERSION!
  parents = [];

  defaultOptions: options = {
    offsetTop: 0,
    offsetLeft: 50,
    offsetRight: 50,
    offsetBottom: 0,
    beforeView: 'beforeView',
    inView: 'inView',
    afterView: 'afterView',
    animationClass: 'ff-animation',
    animationDuration: 700,
    parent: window,
    beforeViewCallBack: () => {
    },
    inViewCallBack: () => {
    },
    afterViewCallBack: () => {
    },
  };

  constructor(_rendererFactory: RendererFactory2) {
    this._renderer = _rendererFactory.createRenderer(null, null);
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

  /**
   *
   * @param item
   * @param coords scroll position x / y
   */
  _getState(item: item, coords: { x: number, y: number }) {
    let newState;
    item.offsets = getOffset(item.dom, item.options.parent);
    let height = 0;
    if (item.options.parent === window) {
      height = item.options.parent.innerHeight;
    } else {
      height = item.options.parent.offsetHeight;
    }

    const scrollBox = this._getParentScroll(item.dom);
    // TODO add functional for check scroll left
    // state 0  - after scroll down
    if (coords.y > item.offsets.offsetBottom - item.options.offsetTop - scrollBox.scrollTop) {
      newState = 0;
    }
    // out of view before scroll into scrolling down
    else if (coords.y + height < item.offsets.offsetTop + item.options.offsetBottom - scrollBox.scrollTop) {
      newState = 2;
    }
    // in view
    else {
      newState = 1;
    }
    if (newState !== item.state) {
      this._changeState(item, newState);
    }
  }

  _changeState(item, state) {
    item.state = state;
    const cssClasses = [item.options.beforeView, item.options.inView, item.options.afterView];
    const callbacks = [item.options.beforeViewCallBack, item.options.inViewCallBack, item.options.afterViewCallBack];
    for (let i = 0, len = cssClasses.length; i < len; i++) {
      this._renderer.removeClass(item.dom, cssClasses[i]);
    }
    if (cssClasses[state]) {
      this._renderer.addClass(item.dom, cssClasses[state]);
      callbacks[state]();
    }
  }

  _scrollCalculate(parent) {
    let x;
    let y;
    if (parent.nativeElement !== window) {
      x = parent.nativeElement.scrollLeft;
      y = parent.nativeElement.scrollTop;
    } else {
      x = window.scrollX;
      y = window.scrollY;
    }
    for (let i = 0, len = parent.elements.length; i < len; i++) {
      this._getState(parent.elements[i], {y, x});
    }
  }

  changeOptions(item, options) {
    // this._changeState(item, 3);
    // options = this._setDefaultOptions(options);
    // item.options = options;
    // this._scrollCalculate();
  }

  _createParentElement(item: item) {
    const that = this;

    const parent = new Parent(item, that);
    this.parents.push(parent);
    let tick = false;
    parent.nativeElement.addEventListener('scroll', () => {
      if (!tick) {
        window.requestAnimationFrame(() => {
          this._scrollCalculate(parent);
          tick = false;
        })
      }
      tick = true;
    }, true);

    return parent;
  }

  removeItem(item: item) {
    this.parents = this.parents.map((container) => {
      container.elements = container.elements.filter(it => item === it);
      return container;
    })
  }

  subscribe(el: ElementRef, options: options) {
    options = this._setDefaultOptions(options);
    const item: item = {
      dom: el,
      state: 3,
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
    return item;
  }
}
