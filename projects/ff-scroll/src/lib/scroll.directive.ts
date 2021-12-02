import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnChanges, OnDestroy,
  SimpleChanges
} from '@angular/core';
import {ScrollService} from './scroll.service';
import {options} from "./scroll.Interface";

@Directive({
  selector: '[ffScroll]',

})
export class ScrollDirective implements OnChanges, AfterViewInit, OnDestroy {
  @Input() ffOptions: options | undefined;
  @HostBinding('class.ff-scroll') cssClass = true;
  item: any;

  constructor(private _el: ElementRef, public scrollService: ScrollService) {
  }

  ngAfterViewInit(): void {
    if (!this.ffOptions) {
      this.ffOptions = {};
    }
    // TODO change name of subscribe - quite misleading as it is not a subscription
    this.item = this.scrollService.subscribe(this._el.nativeElement, this.ffOptions);
  }

  ngOnDestroy() {
    this.scrollService.removeItem(this.item);
  }

  // TODO is this nesseceary ?
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ffOptions'].currentValue && this._el.nativeElement && this.item) {
      this.scrollService.changeOptions(this.item, this.ffOptions);
    }
  }

}
