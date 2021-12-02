import {offsets} from "./scroll.Interface";
import {ElementRef} from "@angular/core";

export function getOffset(elem:any, parent?: ElementRef<any> | undefined): offsets {
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
    offsetTop: offsetTop,
    offsetRight: offsetWidth + offsetLeft,
    offsetBottom: offsetHeight + offsetTop,
    offsetLeft: offsetLeft,
    height: offsetHeight,
    width: offsetWidth,
  };
}
