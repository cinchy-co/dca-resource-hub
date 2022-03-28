import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchByAutocompleteComponent } from './search-by-autocomplete/search-by-autocomplete.component';
import {AutoCompleteModule} from "primeng/autocomplete";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SelectButtonModule} from "primeng/selectbutton";
import {ButtonModule} from "primeng/button";
import {VideoBannerComponent} from "./video-banner/video-banner.component";
import {PipesModule} from "../pipes/pipes.module";



@NgModule({
  declarations: [
    SearchByAutocompleteComponent,
    VideoBannerComponent
  ],
  imports: [
    CommonModule,
    AutoCompleteModule,
    FormsModule,
    ReactiveFormsModule,
    SelectButtonModule,
    ButtonModule,
    PipesModule
  ],
  exports: [
    SearchByAutocompleteComponent,
    VideoBannerComponent
  ]
})
export class DcaCommonModule { }
