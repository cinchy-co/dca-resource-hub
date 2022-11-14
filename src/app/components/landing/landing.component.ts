import {Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {ApiCallsService} from "../../services/api-calls.service";
import {IFooter, ILanding, ISocialMedia} from "../../models/common.model";
import {AppStateService} from "../../services/app-state.service";
import {Router} from "@angular/router";
import {WindowRefService} from "../../services/window-ref.service";
import {isPlatformBrowser} from "@angular/common";
import {ICommunityDetails} from "../../models/general-values.model";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  landingPageDetails: ILanding;
  footerDetails: IFooter[];
  socialMediaDetails: ISocialMedia[];
  mainSectionOptions: ICommunityDetails[];
  sidebarOptions: ICommunityDetails[];
  items: MenuItem[];

  constructor(private appStateService: AppStateService, private appApiService: ApiCallsService,
              private router: Router, private windowRef: WindowRefService,
              @Inject(PLATFORM_ID) private platformId: any,) {
  }

  async ngOnInit() {
    this.appStateService.setCurrentUrl();
    this.setMenuItems();
    this.appStateService.setDisplayOfSidebarToggled(false);
    this.landingPageDetails = (await this.appApiService.getLandingPageDetails().toPromise())[0];
    this.socialMediaDetails = (await this.appApiService.getSocialMediaDetails().toPromise());
    this.footerDetails = this.appStateService.footerDetails;
    if (!this.appApiService.isSignedIn()) {
      this.mainSectionOptions = this.mainSectionOptions.filter(item => item.isBehindLogin !== 'Yes');
    }
    console.log('1111 landingPageDetails', this.mainSectionOptions);
  }

  setMenuItems() {
    this.sidebarOptions = this.appStateService.communityDetails;
    this.mainSectionOptions = this.sidebarOptions.filter(item => item.navigation === 'Main');
    if (!this.appApiService.isSignedIn()) {
      this.mainSectionOptions = this.mainSectionOptions.filter(item => item.isBehindLogin !== 'Yes' && item.sidebarLabel !== 'More');
    }
    console.log('111 mainSectionOptions', this.mainSectionOptions)
    this.items = this.mainSectionOptions.map(({sidebarLabel, sidebarIcon, sidebarRoute}) => ({
      label: sidebarLabel,
      icon: `pi ${sidebarIcon}`,
      command: () => {
        this.menuClicked(sidebarRoute);
      }
    }));
  }

  menuClicked(sidebarRoute: string) {
    this.router.navigate([`/${sidebarRoute}`]);
  }

  signIn() {
    this.appApiService.login();
  }

  goToHome() {
    this.router.navigate([`/`]);
  }

  footerClicked(footer: IFooter) {
    const url = footer.footerLink;
    if (url) {
      if (isPlatformBrowser(this.platformId)) {
        this.windowRef.nativeWindow.open(url, '_blank');
      }
    } else {
      this.router.navigate([`${footer.footerRoute}`]);
    }
  }

  socialMediaClicked(socialMedia: ISocialMedia) {
    const url = socialMedia.socialLink;
    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

}
