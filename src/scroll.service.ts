import {Injectable, RendererFactory2} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

function getOffset(elem) {
    const offsetHeight = elem.offsetHeight,
        offsetWidth = elem.offsetWidth;
    let offsetTop = 0, offsetLeft = 0;
    do {
        if (!isNaN(elem.offsetTop)) {
            offsetTop += elem.offsetTop;
        }
        if (!isNaN(elem.offsetLeft)) {
            offsetLeft += elem.offsetLeft;
        }
        elem = elem.offsetParent;
    } while (elem);
    return {
        offsetTop: offsetTop,
        offsetRight: offsetWidth + offsetLeft,
        offsetBottom: offsetHeight + offsetTop,
        offsetLeft: offsetLeft,
        height: offsetHeight,
        width: offsetWidth,
    };
}


@Injectable()
export class ScrollService {
    _timer: any;
    _pageHeight: number;
    _resizeListener: BehaviorSubject<any> = new BehaviorSubject(0);
    _elements: any = [];
    _windowHeight = 0;
    _x = 0;
    _y = 0;
    _renderer;

    defaultOptions = {
        offsetTop: 50,
        offsetLeft: 50,
        offsetRight: 50,
        offsetBottom: 50,
        beforeView: 'beforeView',
        inView: 'inView',
        afterView: 'afterView',
        animationClass: 'ff-animation',
        animationDuration: 500,
        beforeViewCallBack: () => {
        },
        inViewCallBack: () => {
        },
        afterViewCallBack: () => {
        },
    };

    constructor(_rendererFactory: RendererFactory2) {
        this._renderer = _rendererFactory.createRenderer(null, null);
        window.addEventListener('scroll', () => {
            this._scrollCalculate();
        });
        window.addEventListener('resize', () => {
            this._windowHeight = window.innerHeight;
            this._scrollCalculate();
        });
        this._resizeListener.subscribe((h) => {
            if (h) {
                for (let i = 0, len = this._elements.length; i < len; i++) {
                    this._elements[i].offsets = getOffset(this._elements[i].dom);
                }
                this._scrollCalculate();
            }
        });
        this._init();
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
        this._windowHeight = window.innerHeight;
    }

    _setDefaultOptions(options) {
        options.__proto__ = this.defaultOptions;
        return options;
    }

    subscribeElement(el, options) {
        options = this._setDefaultOptions(options);
        const item = {
            dom: el,
            state: 3,
            options: options,
            offsets: null
        };
        this._elements.push(item);
        this._scrollCalculate();

        return item;
    }

    _getState(item) {
        if (!item.offsets) {
            item.offsets = getOffset(item);
        }
        let newState;
        if (this._y > item.offsets.offsetBottom - item.options.offsetTop) {
            newState = 0;
        } else if (this._y + this._windowHeight < item.offsets.offsetTop + item.options.offsetBottom) {
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

    _scrollCalculate() {
        this._y = window.pageYOffset;
        this._x = window.pageXOffset;
        for (let i = 0, len = this._elements.length; i < len; i++) {
            this._getState(this._elements[i]);
        }
    }

    changeOptions(item, options) {
        this._changeState(item, 3);
        options = this._setDefaultOptions(options);
        item.options = options;
        this._scrollCalculate();
    }
}
