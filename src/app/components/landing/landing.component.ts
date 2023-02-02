import {Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {ApiCallsService} from "../../services/api-calls.service";
import {IFooter, ILanding, ILandingFooter, ILandingNav, ISocialMedia, ITestimonial} from "../../models/common.model";
import {AppStateService} from "../../services/app-state.service";
import {Router} from "@angular/router";
import {WindowRefService} from "../../services/window-ref.service";
import {isPlatformBrowser} from "@angular/common";
import {ICommunityDetails} from "../../models/general-values.model";
import {MenuItem} from "primeng/api";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  landingPageDetails: ILanding;
  footerDetails: {[k: string]: ILandingFooter[]};
  footerKeys: string[];
  socialMediaDetails: ISocialMedia[];
  mainSectionOptions: ICommunityDetails[];
  sidebarOptions: ICommunityDetails[];
  moreSectionOptions: ICommunityDetails[];
  items: MenuItem[];
  cards: any[];
  testimonials: ITestimonial[];
  landingPageNavigation: ILandingNav[];
  showVideo = false;

  constructor(private appStateService: AppStateService, private appApiService: ApiCallsService,
              private router: Router, private windowRef: WindowRefService,
              @Inject(PLATFORM_ID) private platformId: any,) {
  }

  async ngOnInit() {
    this.appStateService.setCurrentUrl();
    this.setMenuItems();
    this.appStateService.setDisplayOfSidebarToggled(false);
    this.landingPageDetails = (await this.appApiService.getLandingPageDetails().toPromise())[0];
    this.landingPageNavigation = (await this.appApiService.getLandingPageNavigation().toPromise());
    this.socialMediaDetails = (await this.appApiService.getSocialMediaDetails().toPromise());
    this.cards = (await this.appApiService.getLandingPageCards().toPromise());
    this.testimonials = (await this.appApiService.getLandingPageTestimonials().toPromise());
    const footerDetails =(await this.appApiService.getLandingPageFooter().toPromise());
    this.footerDetails = this.appStateService.getGroupedItems(footerDetails);
    this.footerKeys = Object.keys(this.footerDetails);
    console.log('1111 landingPageDetails', this.landingPageDetails);
  }

  setMenuItems() {
    this.sidebarOptions = this.appStateService.communityDetails;
    this.moreSectionOptions = this.sidebarOptions.filter(item => item.navigation === 'More');
    this.mainSectionOptions = this.sidebarOptions.filter(item => item.landingNav === 'Yes');
    this.items = this.mainSectionOptions.map(({landingLabel, sidebarIcon, sidebarRoute}) => ({
      label: landingLabel,
      /* icon: `pi ${sidebarIcon}`,*/
      command: () => {
        this.menuClicked(sidebarRoute);
      }
    }));
  }

  menuClicked(sidebarRoute: string) {
    this.appStateService.setSidebarOption(sidebarRoute);
    this.router.navigate([`/${sidebarRoute}`]);
  }

  signIn() {
    this.appApiService.login();
  }

  optionClicked(option: ILandingNav) {
    if (option.redirectLink) {
      this.goToExternalLink(option);
    } else {
      this.appStateService.setSidebarOption(option.redirectRoute);
      this.router.navigate([`${option.redirectRoute}`]);
    }
  }

  goToExternalLink(option: any) {
    if (isPlatformBrowser(this.platformId)) {
      const url = option.redirectURL;
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

  goToDetails(item: any) {
    if (item.redirectURL) {
      this.goToExternalLink(item);
    } else {
      const url = item.redirectRoute;
      this.router.navigate([`${url}`]);
    }
  }

  getIcon(option: ICommunityDetails, isCollapsed?: boolean): IconProp {
    const iconToTake = isCollapsed ? option.collapseIcon : option.landingPageIcons;
    return iconToTake.split(',') as IconProp;
  }

  goToHome() {
    this.router.navigate([`/`]);
  }

  goToPrivacy() {
    const url = this.landingPageDetails.privacyRoute;
    this.router.navigate([`/${url}`]);
  }

  subscribe() {
    this.router.navigate([`/subscribe`]);
  }

  contact() {
    const url = this.landingPageDetails.button1Link;
    this.windowRef.nativeWindow.open(url, '_blank');
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
