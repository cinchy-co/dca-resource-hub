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
import {ChipModule} from "primeng/chip";
import {TableModule} from "primeng/table";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import { HubFormComponent } from './hub-form/hub-form.component';
import {DropdownModule} from "primeng/dropdown";
import {MultiSelectModule} from "primeng/multiselect";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputTextModule} from "primeng/inputtext";
import {ToastModule} from "primeng/toast";



@NgModule({
  declarations: [
    SearchByAutocompleteComponent,
    VideoBannerComponent,
    HeroBannerComponent,
    VideoOverviewComponent,
    HubFormComponent
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
    DividerModule,
    ChipModule,
    TableModule,
    ProgressSpinnerModule,
    DropdownModule,
    MultiSelectModule,
    InputTextareaModule,
    InputTextModule,
    ToastModule
  ],
  exports: [
    SearchByAutocompleteComponent,
    VideoBannerComponent,
    HeroBannerComponent,
    VideoOverviewComponent,
    HubFormComponent
  ]
})
export class DcaCommonModule { }
