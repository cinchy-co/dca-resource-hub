import {Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {ApiCallsService} from "../../services/api-calls.service";
import {IFooter, ILanding, ISocialMedia} from "../../models/common.model";
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
  footerDetails: IFooter[];
  socialMediaDetails: ISocialMedia[];
  mainSectionOptions: ICommunityDetails[];
  sidebarOptions: ICommunityDetails[];
  items: MenuItem[];
  cards: any[];

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
    this.cards = (await this.appApiService.getLandingPageCards().toPromise());
    this.footerDetails = this.appStateService.footerDetails;
    console.log('1111 landingPageDetails', this.landingPageDetails, this.cards);
  }

  setMenuItems() {
    this.sidebarOptions = this.appStateService.communityDetails;
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
    this.router.navigate([`/${sidebarRoute}`]);
  }

  signIn() {
    this.appApiService.login();
  }

  optionClicked(option: ICommunityDetails) {
    if (option.redirectLink) {
      if (isPlatformBrowser(this.platformId)) {
        const url = option.redirectLink;
        this.windowRef.nativeWindow.open(url, '_blank');
      }
    } else {
      this.router.navigate([`${option.sidebarRoute}`]);
    }
  }

  goToDetails(item: any) {
    const url = item.redirectRoute;
    if (url) {
      this.router.navigate([`${url}`]);
    }
  }

  getIcon(option: ICommunityDetails, isCollapsed?: boolean): IconProp {
    const iconToTake = isCollapsed ? option.collapseIcon : option.faIcon;
    return iconToTake.split(',') as IconProp;
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
