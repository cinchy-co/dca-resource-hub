import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchByAutocompleteComponent } from './search-by-autocomplete/search-by-autocomplete.component';
import {AutoCompleteModule} from "primeng/autocomplete";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SelectButtonModule} from "primeng/selectbutton";
import {ButtonModule} from "primeng/button";



@NgModule({
  declarations: [
    SearchByAutocompleteComponent
  ],
    imports: [
        CommonModule,
        AutoCompleteModule,
        FormsModule,
        ReactiveFormsModule,
        SelectButtonModule,
        ButtonModule
    ],
  exports: [
    SearchByAutocompleteComponent
  ]
})
export class DcaCommonModule { }
