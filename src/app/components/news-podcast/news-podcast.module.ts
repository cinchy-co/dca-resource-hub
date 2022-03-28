import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsPodcastComponent } from './news-podcast.component';
import {PaginatorModule} from "primeng/paginator";
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {DcaCommonModule} from "../../dca-common/dca-common.module";
import {RadioButtonModule} from "primeng/radiobutton";
import {ChipModule} from "primeng/chip";
import {RouterModule} from "@angular/router";
import { EllipsisModule } from 'ngx-ellipsis';
import {ProgressSpinnerModule} from "primeng/progressspinner";


const routes = [
  {
    path: '',
    component: NewsPodcastComponent,
  }
];

@NgModule({
  declarations: [
    NewsPodcastComponent
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
    DcaCommonModule
  ]
})
export class NewsPodcastModule { }
