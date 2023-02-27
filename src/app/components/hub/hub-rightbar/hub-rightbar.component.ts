import {Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {IFooter, ISocialMedia, IUser} from "../../../models/common.model";
import {WindowRefService} from "../../../services/window-ref.service";
import {isPlatformBrowser} from "@angular/common";
import {Router} from "@angular/router";
import {AppStateService} from "../../../services/app-state.service";
import {ReplaySubject, takeUntil} from "rxjs";
import {ITopNews} from "../model/hub.model";
import {ICommunityDetails} from "../../../models/general-values.model";

@Component({
  selector: 'app-hub-rightbar',
  templateUrl: './hub-rightbar.component.html',
  styleUrls: ['./hub-rightbar.component.scss']
})
export class HubRightbarComponent implements OnInit, OnDestroy {
  @Input() userDetails: IUser;
  @Input() footerDetails: IFooter[];
  @Input() socialMediaDetails: ISocialMedia[];
  @Input() topNews: ITopNews[];
  @Input() pageDetails: ICommunityDetails;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private windowRef: WindowRefService, private appStateService: AppStateService,
              @Inject(PLATFORM_ID) private platformId: any, private router: Router) {
  }

  ngOnInit(): void {
    this.appStateService.getUserDetailsSub().pipe(takeUntil(this.destroyed$))
      .subscribe(async (userDetails: IUser) => {
        this.userDetails = userDetails;
      })
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

  goToProfile() {
    this.router.navigate([`/profile`]);
  }

  goToNews(news?: ITopNews) {
    const route = news ? `apps/privacy-newsfeed/${news.id}` : `apps/privacy-newsfeed/`;
    this.router.navigate([route])
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
