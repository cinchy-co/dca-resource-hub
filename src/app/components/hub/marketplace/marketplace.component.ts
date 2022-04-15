import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {AppStateService} from "../../../services/app-state.service";
import {ICommunityDetails} from "../../../models/general-values.model";
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "../../../services/window-ref.service";

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})
export class MarketplaceComponent implements OnInit {
  marketPlaceDetails: ICommunityDetails;

  constructor(private appStateService: AppStateService, @Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService) { }

  ngOnInit(): void {
    const communityDetails = this.appStateService.communityDetails;
    this.marketPlaceDetails = communityDetails.find(item => item.id === 'marketplace') as ICommunityDetails;
  }

  goToMarketPlace() {
    const url = this.marketPlaceDetails.buttonLink;
    if(isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

}
