import {ElementRef} from "@angular/core";

export interface options {
  offsetTop?: number;
  offsetLeft?: number;
  offsetRight?: number;
  offsetBottom?: number;
  beforeView?: string;
  inView?: string;
  afterView?: string;
  animationClass?: string;
  animationDuration?: 500,
  parent?: Window | Document | HTMLBodyElement | HTMLElement;
  beforeViewCallBack?: () => void;
  inViewCallBack?: () => void;
  afterViewCallBack?: () => void;

}

type state = 0 | 1 | 2 | 3;

export interface item {
  dom: ElementRef;
  state: state;
  options: options;
  offsets: null | offsets
}

export interface offsets {

  offsetTop: number;
  offsetRight: number;
  offsetBottom: number;
  offsetLeft: number;
  height: number;
  width: number;

}
