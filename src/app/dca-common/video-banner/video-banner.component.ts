import {AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import * as Plyr from 'plyr';
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "../../services/window-ref.service";
import {IWebsiteDetails} from "../../models/common.model";

@Component({
  selector: 'app-video-banner',
  templateUrl: './video-banner.component.html',
  styleUrls: ['./video-banner.component.scss']
})
export class VideoBannerComponent implements OnInit, AfterViewInit {
  @Input() bannerDetails: IWebsiteDetails;
  youtubeSources: Plyr.Source[] = [
    {
      src: 'https://youtube.com/watch?v=bTqVqk7FSmY',
      provider: 'youtube',
    },
  ];
  isLoaded: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // const FaIconComponent = (await import('@fortawesome/angular-fontawesome')).FaIconComponent

  }

  joinNow() {

  }


  goToFeedback() {
    const url = 'https://docs.google.com/forms/d/e/1FAIpQLScqqzHjk2BSiDu4_7O-d8L8f31Gze72Wkb7UK4POLsECXiqkw/viewform?usp=sf_link';
    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }
}
