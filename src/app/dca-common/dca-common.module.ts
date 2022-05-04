import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchByAutocompleteComponent } from './search-by-autocomplete/search-by-autocomplete.component';
import {AutoCompleteModule} from "primeng/autocomplete";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SelectButtonModule} from "primeng/selectbutton";
import {ButtonModule} from "primeng/button";
import {VideoBannerComponent} from "./video-banner/video-banner.component";
import {PipesModule} from "../pipes/pipes.module";
import { HeroBannerComponent } from './hero-banner/hero-banner.component';
import { VideoOverviewComponent } from './video-overview/video-overview.component';
import {CardModule} from "primeng/card";
import {DividerModule} from "primeng/divider";



@NgModule({
  declarations: [
    SearchByAutocompleteComponent,
    VideoBannerComponent,
    HeroBannerComponent,
    VideoOverviewComponent
  ],
  imports: [
    CommonModule,
    AutoCompleteModule,
    FormsModule,
    ReactiveFormsModule,
    SelectButtonModule,
    ButtonModule,
    PipesModule,
    CardModule,
    DividerModule
  ],
  exports: [
    SearchByAutocompleteComponent,
    VideoBannerComponent,
    HeroBannerComponent,
    VideoOverviewComponent
  ]
})
export class DcaCommonModule { }
