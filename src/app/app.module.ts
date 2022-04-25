import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ComponentsModule} from "./components/components.module";
import {HttpClientModule} from "@angular/common/http";
import {faFacebookSquare, faLinkedinIn, faTwitterSquare} from '@fortawesome/free-brands-svg-icons';
import {FaIconLibrary} from "@fortawesome/angular-fontawesome";
import {HubSidebarComponent} from "./components/hub-sidebar/hub-sidebar.component";
import {ConfigService} from "./config.service";
import {CinchyConfig, CinchyModule, CinchyService} from "@cinchy-co/angular-sdk";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";

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
    RippleModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appLoadFactory,
      deps: [ConfigService],
      multi: true
    },
    CinchyModule,
    CinchyService,
    {
      provide: CinchyConfig,
      useFactory: (config: ConfigService) => {
        return config.envConfig;
      },
      deps: [ConfigService]
    },
    {provide: 'BASE_URL', useFactory: getBaseUrl}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(iconLibrary: FaIconLibrary) {
    iconLibrary.addIcons(...icons);
  }
}
