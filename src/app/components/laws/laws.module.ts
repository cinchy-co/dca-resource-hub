import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LawsComponent} from "./law/laws.component";
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
import {HomeComponent} from "./home.component";
import {AccordionModule} from "primeng/accordion";
import {PanelModule} from "primeng/panel";
import {TabMenuModule} from "primeng/tabmenu";

const routes = [
  {
    path: '',
    component: HomeComponent,
  }
];

@NgModule({
  declarations: [
    LawsComponent,
    HomeComponent
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
        PanelModule,
        TabMenuModule
    ]
})
export class LawsModule { }
