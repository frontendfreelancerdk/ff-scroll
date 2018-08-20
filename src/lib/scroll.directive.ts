import {Directive, ElementRef, HostBinding, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ScrollService} from './scroll.service';

@Directive({
  selector: '[ffScroll]'
})
export class ScrollDirective implements OnInit, OnChanges {
  @Input() ffOptions: any;
  @HostBinding('class.ff-scroll') cssClass = true;
  item: any;

  constructor(private _el: ElementRef, public scrollService: ScrollService) {
  }

  ngOnInit(): void {
    if (!this.ffOptions) {
      this.ffOptions = {};
    }
    // TODO new v
      this.item = this.scrollService.subscribe(this._el.nativeElement, this.ffOptions);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ffOptions.currentValue && this._el.nativeElement && this.item) {
      this.scrollService.changeOptions(this.item, this.ffOptions);
    }
  }

}
