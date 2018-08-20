import { NgModule } from '@angular/core';
import {ScrollDirective} from './scroll.directive';
import {ScrollService} from './scroll.service';

@NgModule({
  imports: [
  ],
  declarations: [
    ScrollDirective
  ],
  exports     : [
    ScrollDirective
  ],
  providers   : [ScrollService]
})
export class FFScrollModule { }
