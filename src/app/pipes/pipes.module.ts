import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UrlSanitizerPipe} from "./url-sanitizer.pipe";


@NgModule({
  declarations: [
    UrlSanitizerPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UrlSanitizerPipe
  ]
})
export class PipesModule {
}
