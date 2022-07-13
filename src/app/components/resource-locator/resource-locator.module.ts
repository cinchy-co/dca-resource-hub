import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceLocatorComponent } from './resource-locator.component';
import {DcaCommonModule} from "../../dca-common/dca-common.module";
import {TabMenuModule} from "primeng/tabmenu";
import {RouterModule} from "@angular/router";
import {ChipModule} from "primeng/chip";
import {ProgressSpinnerModule} from "primeng/progressspinner";


const routes = [
  {
    path: '',
    component: ResourceLocatorComponent,
  }
];


@NgModule({
  declarations: [
    ResourceLocatorComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DcaCommonModule,
    TabMenuModule,
    ChipModule,
    ProgressSpinnerModule
  ]
})
export class ResourceLocatorModule { }
