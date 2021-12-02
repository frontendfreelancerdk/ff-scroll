import {BehaviorSubject} from "rxjs";
import {getOffset} from "./helpers";
import {ScrollService} from "./scroll.service";
import {item, offsets} from "./scroll.Interface"

export class Parent {
  nativeElement;
  cacheHeight;
  offsets: offsets | undefined;
  elements: item[] = [];
  that;
  resizeListener: BehaviorSubject<any> = new BehaviorSubject(0);

  constructor(item: item, that: ScrollService) {
    this.nativeElement = item.options.parent!;
    //@ts-ignore
    this.cacheHeight = this.nativeElement?.clientHeight || 0;
    this.elements.push(item);
    this.that = that;
  }

  onResize(/*h*/) {
    //if (h) {
    console.log("i dont think it is ever called")
    for (let i = 0, len = this.elements.length; i < len; i++) {
      this.elements[i].offsets = getOffset(this.elements[i].dom);
    }
    this.that._scrollCalculate(this.nativeElement);
  }

  //}
}
