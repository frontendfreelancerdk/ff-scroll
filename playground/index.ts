/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FFScrollModule } from '../src';


@Component({
  selector: 'app',
  template: `<div ffScroll></div>`
})
class AppComponent {}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, FFScrollModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
