import {Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {IAvatar} from "../../models/common.model";
import {WindowRefService} from "../../services/window-ref.service";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-avatars',
  templateUrl: './avatars.component.html',
  styleUrls: ['./avatars.component.scss']
})
export class AvatarsComponent implements OnInit {
  @Input() avatars: IAvatar[];
  @Input() size: string = 'xlarge';

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService) {
  }

  ngOnInit(): void {
  }

  avatarClicked(avatar: IAvatar) {
    if(isPlatformBrowser(this.platformId)) {
      const url = avatar.linkedinUrl;
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

}
