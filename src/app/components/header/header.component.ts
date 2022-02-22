import {Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {IAvatar} from "../../models/common.model";
import {Router} from "@angular/router";
import {WindowRefService} from "../../services/window-ref.service";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() avatars: IAvatar[];

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService) {
  }

  ngOnInit() {
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  login() {
    const url = 'https://datacollaboration.net/';
    if(isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

  joinFree() {
    const url = 'https://www.datacollaboration.org/dataprivacy';
    if(isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

}
