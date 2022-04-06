import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RegHomeComponent} from "./reg-home.component";
import {RouterModule} from "@angular/router";
import {PaginatorModule} from "primeng/paginator";
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {DcaCommonModule} from "../../dca-common/dca-common.module";
import {RadioButtonModule} from "primeng/radiobutton";
import {ChipModule} from "primeng/chip";
import {EllipsisModule} from "ngx-ellipsis";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ComponentsModule} from "../components.module";
import {AccordionModule} from "primeng/accordion";
import {RegulatorsComponent} from "./regulator/regulators.component";
import {PanelModule} from "primeng/panel";

const routes = [
  {
    path: '',
    component: RegHomeComponent,
  }
];

@NgModule({
  declarations: [
    RegHomeComponent,
    RegulatorsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PaginatorModule,
    CardModule,
    ButtonModule,
    DcaCommonModule,
    RadioButtonModule,
    ChipModule,
    EllipsisModule,
    ProgressSpinnerModule,
    DcaCommonModule,
    ComponentsModule,
    AccordionModule,
    PanelModule
  ]
})
export class RegulatorsModule { }
