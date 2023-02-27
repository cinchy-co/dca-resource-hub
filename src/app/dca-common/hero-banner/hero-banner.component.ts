import {Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {ISponsor, IWebsiteDetails} from "../../models/common.model";
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "../../services/window-ref.service";
import {ICollab, ITools} from "../../components/hub/model/hub.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-hero-banner',
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.scss']
})
export class HeroBannerComponent implements OnInit {
  @Input() toolDetails: ITools | ICollab;
  @Input() sponsors: ISponsor[];
  @Output() sidebarToggled: EventEmitter<any> = new EventEmitter<any>();

  constructor(@Inject(PLATFORM_ID) private platformId: any, private router: Router,
              private windowRef: WindowRefService) {
  }

  ngOnInit(): void {
  }

  toggleSidebar() {
    this.sidebarToggled.emit();
  }

  goToFeedback() {
    const url = 'https://docs.google.com/forms/d/e/1FAIpQLScqqzHjk2BSiDu4_7O-d8L8f31Gze72Wkb7UK4POLsECXiqkw/viewform?usp=sf_link';
    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

  goToDetails(item: any) {
    if(item.route) {
      const route: string = item.route;
      this.router.navigate([route]);
      return ;
    }
    if (isPlatformBrowser(this.platformId)) {
      const url = item.logoLink;
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

}
