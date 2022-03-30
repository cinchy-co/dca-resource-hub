import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HubComponent } from './hub.component';
import {RouterModule} from "@angular/router";
import { HubSidebarComponent } from './hub-sidebar/hub-sidebar.component';
import { ToolsComponent } from './tools/tools.component';
import { TablesComponent } from './tables/tables.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { HubHomeComponent } from './hub-home/hub-home.component';
import { HubRightbarComponent } from './hub-rightbar/hub-rightbar.component';
import {DividerModule} from "primeng/divider";
import {CardModule} from "primeng/card";

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
      }
    ]
  }
];

@NgModule({
  declarations: [
    HubComponent,
    HubSidebarComponent,
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
