import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollDirective } from './scroll.directive';
import { ScrollService } from './scroll.service';

export * from './scroll.directive';
export * from './scroll.service';

@NgModule({
    imports     : [
        CommonModule
    ],
    declarations: [
        ScrollDirective,
    ],
    exports     : [
        ScrollDirective
    ],
    providers   : [ScrollService]
})
export class FFScrollModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule : FFScrollModule,
            providers: [ScrollService]
        };
    }
}
