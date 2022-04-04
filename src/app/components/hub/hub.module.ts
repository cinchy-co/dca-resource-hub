import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HubComponent } from './hub.component';
import {RouterModule} from "@angular/router";
import { ToolsComponent } from './tools/tools.component';
import { TablesComponent } from './tables/tables.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { HubHomeComponent } from './hub-home/hub-home.component';
import { HubRightbarComponent } from './hub-rightbar/hub-rightbar.component';
import {DividerModule} from "primeng/divider";
import {CardModule} from "primeng/card";
import {HomeComponent} from "../home/home.component";

const routes = [
  {
    path: '',
    component: HubComponent,
    children : [
      {
        path: '',
        component: HubHomeComponent
      },
      {
        path: 'tools',
        component: ToolsComponent
      },
      {
        path: 'tables',
        component: TablesComponent
      },
      {
        path: 'suggestions',
        component: SuggestionsComponent
      },
      {
        path: 'bookmarks',
        component: BookmarksComponent
      },
      {
        path: 'tools/privacy-legislation-navigator',
        loadChildren: () => import('../pipps/pipps.module').then(m => m.PippsModule),
      },
      {
        path: 'tools/privacy-newsfeed',
        loadChildren: () => import('../news-podcast/news-podcast.module').then(m => m.NewsPodcastModule),
      },
      {
        path: 'tools/privacy-law-navigator',
        component: HomeComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    HubComponent,
    ToolsComponent,
    TablesComponent,
    SuggestionsComponent,
    BookmarksComponent,
    HubHomeComponent,
    HubRightbarComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        DividerModule,
        CardModule,
    ],
  exports: [RouterModule]
})
export class HubModule { }
