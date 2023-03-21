import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {AppStateService} from "./services/app-state.service";
import {CinchyService} from "@cinchy-co/angular-sdk";
import {ApiCallsService} from "./services/api-calls.service";
import {IUser} from "./models/common.model";
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "./services/window-ref.service";
import {environment} from 'src/environments/environment';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dca-privacy-leg';
  isSidebarExpanded = true;
  isSidebarHidden = true;
  loginDone: boolean;
  userDetails: IUser;
  isMobileOrTab: boolean;

  constructor(private appStateService: AppStateService, private cinchyService: CinchyService,
              private apiCallsService: ApiCallsService, @Inject(PLATFORM_ID) private platformId: any,
              private windowRefService: WindowRefService, private router: Router) {
  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const url = this.windowRefService.nativeWindow.location.href;
      if (!sessionStorage.getItem('current-url-hub')) {
        sessionStorage.setItem('current-url-hub', url);
      }

      if (sessionStorage.getItem('nonce')) {
        this.apiCallsService.login();
      } else {
        this.setRoutingAndGlobalDetails();
      }
    }

    this.appStateService.getRoutingOnLogin().subscribe(val => {
      if (val) {
        this.setRoutingAndGlobalDetails()
      }
    })
  }

  async setRoutingAndGlobalDetails() {
    this.appStateService.communityDetails = await this.apiCallsService.getCommunityPageDetails().toPromise();
    this.apiCallsService.getFooterDetails().subscribe(footer => {
      this.appStateService.footerDetails = footer;
    });
    this.loginDone = true;

    if (isPlatformBrowser(this.platformId)) {
      this.isMobileOrTab = this.windowRefService.nativeWindow.innerWidth < 1040;
      this.isSidebarExpanded = !this.isMobileOrTab;
      this.sidebarStateChange(this.isSidebarExpanded);
      this.setRouting();
    }
    this.userDetails = this.appStateService.userDetails;
  }

  setRouting() {
    const currentUrl = sessionStorage.getItem('current-url-hub');
    let route: any = '/';
    if (environment.production) {
      route = currentUrl?.split('/hub')[1] || route;
    } else {
      route = currentUrl?.split(':3000')[1] || currentUrl?.split('/hub')[1] || route;
    }
    const routeWithoutQueryParam = route.split('?')[0];
    console.log('1111 routeWithoutQueryParam', routeWithoutQueryParam, routeWithoutQueryParam === '/landing');
    if (routeWithoutQueryParam === '/' && !this.apiCallsService.isSignedIn()) {
      this.router.navigate([`landing`]);
    } else if (routeWithoutQueryParam === '/landing' && this.apiCallsService.isSignedIn()) {
      console.log('1111 IN LANDING SIGN NIN')
      this.router.navigate([`/home`]);
    } else {
      const queryParams: any = {};
      if (route.split('?')[1]) {
        const urlParams = new URLSearchParams(route.split('?')[1]);
        urlParams.forEach((value, key) => {
          queryParams[key] = value;
        });
      }
      this.router.navigate([`${routeWithoutQueryParam}`], {queryParams});
    }
    sessionStorage.removeItem('current-url-hub')
  }

  sidebarStateChange(isExpanded: boolean) { // toggle doesn't completely hide it
    this.isSidebarExpanded = isExpanded;
    this.appStateService.setSidebarToggled(isExpanded);
  }

  hideOrShowSideBar(isShown: boolean) {
    this.isSidebarHidden = !isShown;
  }
}
