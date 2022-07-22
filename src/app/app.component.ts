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
  loginDone: boolean;
  userDetails: IUser;
  isMobileOrTab: boolean;

  constructor(private appStateService: AppStateService, private cinchyService: CinchyService,
              private apiCallsService: ApiCallsService, @Inject(PLATFORM_ID) private platformId: any,
              private windowRefService: WindowRefService, private router: Router) {
  }

  async ngOnInit() {
    const url = this.windowRefService.nativeWindow.location.href;
    if (isPlatformBrowser(this.platformId)) {
      if (!sessionStorage.getItem('current-url-hub')) {
        sessionStorage.setItem('current-url-hub', url);
      }
    }
    this.cinchyService.checkIfSessionValid().toPromise().then((response: any) => {
      if (response.accessTokenIsValid) {
        this.setDetails();
      } else {
        if (isPlatformBrowser(this.platformId)) {
          this.cinchyService.login().then(success => {
            if (success) {
              this.setDetails();
            }
          }, error => {
            console.error('Could not login: ', error)
          });
        }
      }
    })
  }

  async setDetails() {
    this.apiCallsService.setUserDetails().then(val => {
      this.userDetails = val;
      this.appStateService.userDetails = this.userDetails;
      this.appStateService.setUserDetailsSub(this.userDetails);
      const userDetail = localStorage.getItem('hub-user-details') || '';
      //  console.log('In user details', val);
      if (!val && userDetail) {
        //  console.log('In no user details if', userDetail);
        this.userDetails = userDetail ? JSON.parse(userDetail) : null;
        this.appStateService.userDetails = this.userDetails;
        this.appStateService.setUserDetailsSub(this.userDetails);
      }
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('hub-user-details', JSON.stringify(val));
      }
    }).catch((e: any) => {
      if (isPlatformBrowser(this.platformId)) {
        console.error(e);
        const userDetail = localStorage.getItem('hub-user-details') || '';
        this.userDetails = userDetail ? JSON.parse(userDetail) : null;
        this.appStateService.userDetails = this.userDetails;
        this.appStateService.setUserDetailsSub(this.userDetails);
        console.error(e);
      }
    });
    this.setRoutingAndGlobalDetails();
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
      const currentUrl = sessionStorage.getItem('current-url-hub');
      let route: any = '/';
      if (environment.production) {
        route = currentUrl?.split('/hub')[1] || route;
      } else {
        route = currentUrl?.split(':3000')[1] || currentUrl?.split('/hub')[1] || route;
      }
      const routeWithoutQueryParam = route.split('?')[0];
      const queryParams: any = {};
      if (route.split('?')[1]) {
        const urlParams = new URLSearchParams(route.split('?')[1]);
        urlParams.forEach((value, key) => {
          queryParams[key] = value;
        });
      }
      this.router.navigate([`${routeWithoutQueryParam}`], {queryParams});
      sessionStorage.removeItem('current-url-hub')
    }
  }

  sidebarStateChange(isExpanded: boolean) {
    this.isSidebarExpanded = isExpanded;
    this.appStateService.setSidebarToggled(isExpanded);
  }
}
