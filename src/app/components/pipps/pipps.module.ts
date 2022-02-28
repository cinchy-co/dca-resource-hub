import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PippsComponent} from './pipps.component';
import {RouterModule} from "@angular/router";
import {DcaCommonModule} from "../../dca-common/dca-common.module";
import {SidebarModule} from "primeng/sidebar";
import {PanelModule} from "primeng/panel";
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from "@angular/forms";
import {CardModule} from "primeng/card";
import {DividerModule} from "primeng/divider";
import {ButtonModule} from "primeng/button";

const routes = [
  {
    path: '',
    component: PippsComponent,
  },
  {
    path: ':article',
    component: PippsComponent,
  },
  {
    path: ':legislation',
    component: PippsComponent,
  },
];

@NgModule({
  declarations: [
    PippsComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        DcaCommonModule,
        SidebarModule,
        PanelModule,
        DropdownModule,
        FormsModule,
        CardModule,
        DividerModule,
        ButtonModule
    ]
})
export class PippsModule {
}
