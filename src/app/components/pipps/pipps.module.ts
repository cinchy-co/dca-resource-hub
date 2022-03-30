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
import {PipesModule} from "../../pipes/pipes.module";
import { KeyIssuesComponent } from './key-issues/key-issues.component';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ChipModule} from "primeng/chip";
import {ComponentsModule} from "../components.module";

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
  {
    path: 'keyIssues/:keyIssueId',
    component: KeyIssuesComponent,
  }
];

@NgModule({
  declarations: [
    PippsComponent,
    KeyIssuesComponent
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
        ButtonModule,
        PipesModule,
        ProgressSpinnerModule,
        ChipModule,
        ComponentsModule
    ]
})
export class PippsModule {
}
