import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ComponentsModule} from "./components/components.module";
import {HttpClientModule} from "@angular/common/http";
import {faFacebookSquare, faLinkedinIn, faTwitterSquare} from '@fortawesome/free-brands-svg-icons';
import {FaIconLibrary, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {HubSidebarComponent} from "./components/hub-sidebar/hub-sidebar.component";
import {ConfigService} from "./config.service";
import {CinchyConfig, CinchyModule, CinchyService} from "@cinchy-co/angular-sdk";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {ProgressSpinnerModule} from "primeng/progressspinner";

import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from "@fortawesome/free-regular-svg-icons";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {environment} from 'src/environments/environment';


const icons = [
  // ... other icons
  faFacebookSquare, faTwitterSquare, faLinkedinIn
];

export function appLoadFactory(config: ConfigService) {
  return () => config.loadConfig().toPromise();
}

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

@NgModule({
  declarations: [
    AppComponent,
    HubSidebarComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    AppRoutingModule,
    BrowserAnimationsModule,
    ComponentsModule,
    HttpClientModule,
    CinchyModule.forRoot(),
    ButtonModule,
    RippleModule,
    ProgressSpinnerModule,
    FontAwesomeModule,
    ToastModule
  ],
  providers: [
    CinchyModule,
    CinchyService,
    {
      provide: CinchyConfig, useValue: environment.cinchyConfig
    },
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(iconLibrary: FaIconLibrary) {
    // @ts-ignore
    iconLibrary.addIcons(...icons);
    iconLibrary.addIconPacks(far, fas);
  }
}
