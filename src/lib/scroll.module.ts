import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { ScrollDirective } from './scroll.directive';
import { ScrollService } from './scroll.service';

@NgModule({
  imports     : [],
  declarations: [
    ScrollDirective
  ],
  exports     : [
    ScrollDirective
  ]
})
export class FFScrollModule {
  constructor(@Optional() @SkipSelf() parentModule : FFScrollModule) {
    if (parentModule) {
      console.log(  'FFScrollModule is already loaded.');
    }
  }

  static forRoot() : ModuleWithProviders {
    return {
      ngModule : FFScrollModule,
      providers   : [ScrollService]
    };
  }
}
