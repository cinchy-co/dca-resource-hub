import {Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {IFooter, ISocialMedia, IUser} from "../../../models/common.model";
import {WindowRefService} from "../../../services/window-ref.service";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-hub-rightbar',
  templateUrl: './hub-rightbar.component.html',
  styleUrls: ['./hub-rightbar.component.scss']
})
export class HubRightbarComponent implements OnInit {
  @Input() userDetails: IUser;
  @Input() footerDetails: IFooter[];
  @Input() socialMediaDetails: ISocialMedia[];

  constructor(private windowRef: WindowRefService,
              @Inject(PLATFORM_ID) private platformId: any) {
  }

  ngOnInit(): void {
    console.log('pppp USEr Details', this.userDetails);
  }

  footerClicked(footer: IFooter) {
    const url = footer.footerLink;
    if(isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

  socialMediaClicked(socialMedia: ISocialMedia) {
    const url = socialMedia.socialLink;
    if(isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

}
