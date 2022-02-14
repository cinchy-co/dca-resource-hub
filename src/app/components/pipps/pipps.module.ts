import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PippsComponent} from './pipps.component';
import {RouterModule} from "@angular/router";
import {DcaCommonModule} from "../../dca-common/dca-common.module";
import {SidebarModule} from "primeng/sidebar";
import {PanelModule} from "primeng/panel";

const routes = [
  {
    path: '',
    component: PippsComponent,
  },
  {
    path: ':article',
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
    PanelModule
  ]
})
export class PippsModule {
}
