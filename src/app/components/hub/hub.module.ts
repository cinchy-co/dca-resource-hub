import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HubComponent} from './hub.component';
import {RouterModule} from "@angular/router";
import {ToolsComponent} from './tools/tools.component';
import {TablesComponent} from './tables/tables.component';
import {SuggestionsComponent} from './suggestions/suggestions.component';
import {BookmarksComponent} from './bookmarks/bookmarks.component';
import {HubHomeComponent} from './hub-home/hub-home.component';
import {HubRightbarComponent} from './hub-rightbar/hub-rightbar.component';
import {DividerModule} from "primeng/divider";
import {CardModule} from "primeng/card";
import {MarketplaceComponent} from './marketplace/marketplace.component';
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {EventsComponent} from './events/events.component';
import {LearningComponent} from './learning/learning.component';
import {CollabsComponent} from './collabs/collabs.component';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {CommonHeaderComponent} from './common-header/common-header.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ProfileFormComponent} from "../profile-form/profile-form.component";
import {InputTextareaModule} from "primeng/inputtextarea";
import {MultiSelectModule} from "primeng/multiselect";
import {ChipModule} from "primeng/chip";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {CollabDetailsComponent} from './collab-details/collab-details.component';
import {DcaCommonModule} from "../../dca-common/dca-common.module";
import {TabMenuModule} from "primeng/tabmenu";
import {PipesModule} from "../../pipes/pipes.module";
import {GettingStartedComponent} from './getting-started/getting-started.component';
import {TableModule} from "primeng/table";
import {ProfilePreferencesComponent} from "../profile-preferences/profile-preferences.component";
import {NgAddToCalendarModule} from "@trademe/ng-add-to-calendar";
import {DialogModule} from "primeng/dialog";
import {VirtualScrollerModule} from "primeng/virtualscroller";
import {TieredMenuModule} from "primeng/tieredmenu";
import {EventDetailsComponent} from './event-details/event-details.component';
import {NgxPageScrollModule} from "ngx-page-scroll";
import { CalendarModule } from 'primeng/calendar';
import {MessageModule} from "primeng/message";
import {MessagesModule} from "primeng/messages";
import { MemberProfileComponent } from './member-profile/member-profile.component';
import {SubscribeComponent} from "./subscribe/subscribe.component";
import {UnSubscribeComponent} from "./un-subscribe/un-subscribe.component";

const routes = [
  {
    path: '',
    component: HubComponent,
    children: [
      {
        path: '',
        component: HubHomeComponent
      },
      {
        path: 'home',
        component: HubHomeComponent
      },
      {
        path: 'profile',
        component: ProfileFormComponent
      },
      {
        path: 'apps',
        component: ToolsComponent
      },
      {
        path: 'tables',
        component: TablesComponent
      },
      {
        path: 'ideas',
        component: SuggestionsComponent
      },
      {
        path: 'bookmarks',
        component: BookmarksComponent
      },
      {
        path: 'marketplace',
        component: MarketplaceComponent
      },
      {
        path: 'events',
        component: EventsComponent
      },
      {
        path: 'events/:id',
        component: EventDetailsComponent
      },
      {
        path: 'learning',
        component: LearningComponent
      },
      {
        path: 'collaboration',
        component: CollabsComponent
      },
      {
        path: 'collab-privacy-laws',
        component: CollabDetailsComponent
      },
      {
        path: 'collab-privacy-regulators',
        component: CollabDetailsComponent
      },
      {
        path: 'sensitive-personal-info-taxonomy',
        component: CollabDetailsComponent
      },
      {
        path: 'collab-mucp',
        component: CollabDetailsComponent
      },
      {
        path: 'collab-data-collaboration-policy',
        component: CollabDetailsComponent
      },
      {
        path: 'collab-human-rights',
        component: CollabDetailsComponent
      },
      {
        path: 'preferences',
        component: ProfilePreferencesComponent
      },
      {
        path: 'member-profile',
        component: MemberProfileComponent
      },
      {
        path: 'member-profile/:id',
        component: MemberProfileComponent
      },
      {
        path: 'apps/privacy-legislation-text',
        loadChildren: () => import('../pipps/pipps.module').then(m => m.PippsModule),
      },
      {
        path: 'apps/privacy-newsfeed',
        loadChildren: () => import('../news-podcast/news-podcast.module').then(m => m.NewsPodcastModule),
      },
      {
        path: 'apps/privacy-newsfeed/:id',
        loadChildren: () => import('../news-podcast/news-podcast.module').then(m => m.NewsPodcastModule),
      },
      {
        path: 'apps/privacy-law-navigator',
        loadChildren: () => import('../laws/laws.module').then(m => m.LawsModule)
      },
      {
        path: 'apps/privacy-law-navigator/:id',
        loadChildren: () => import('../laws/laws.module').then(m => m.LawsModule)
      },
      {
        path: 'apps/privacy-regulators',
        loadChildren: () => import('../regulators/regulators.module').then(m => m.RegulatorsModule)
      },
      {
        path: 'apps/privacy-regulators/:id',
        loadChildren: () => import('../regulators/regulators.module').then(m => m.RegulatorsModule)
      },
      {
        path: 'apps/privacy-resource-locator',
        loadChildren: () => import('../resource-locator/resource-locator.module').then(m => m.ResourceLocatorModule)
      },
      {
        path: 'subscribe',
        component: SubscribeComponent
      },
      {
        path: 'unsubscribe',
        component: UnSubscribeComponent
      },
      {
        path: ':route',
        component: GettingStartedComponent
      },
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
    HubRightbarComponent,
    MarketplaceComponent,
    EventsComponent,
    LearningComponent,
    CollabsComponent,
    CommonHeaderComponent,
    CollabDetailsComponent,
    GettingStartedComponent,
    EventDetailsComponent,
    MemberProfileComponent,
    SubscribeComponent,
    UnSubscribeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DividerModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    DropdownModule,
    ProgressSpinnerModule,
    ToastModule,
    FontAwesomeModule,
    InputTextareaModule,
    MultiSelectModule,
    ChipModule,
    OverlayPanelModule,
    DcaCommonModule,
    TabMenuModule,
    PipesModule,
    TableModule,
    NgAddToCalendarModule,
    DialogModule,
    VirtualScrollerModule,
    TieredMenuModule,
    NgxPageScrollModule,
    CalendarModule,
    FormsModule,
    MessageModule,
    MessagesModule
  ],
  exports: [RouterModule]
})
export class HubModule {
}
