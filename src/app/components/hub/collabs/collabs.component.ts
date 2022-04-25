import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ICommunityDetails} from "../../../models/general-values.model";
import {AppStateService} from "../../../services/app-state.service";
import {ApiCallsService} from "../../../services/api-calls.service";
import {ICollab} from "../model/hub.model";
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "../../../services/window-ref.service";

@Component({
  selector: 'app-collabs',
  templateUrl: './collabs.component.html',
  styleUrls: ['./collabs.component.scss']
})
export class CollabsComponent implements OnInit {
  collabsDetails: ICommunityDetails;
  collabs: ICollab[];

  constructor(private appStateService: AppStateService, private appApiService: ApiCallsService,
              @Inject(PLATFORM_ID) private platformId: any, private windowRef: WindowRefService) { }

  async ngOnInit() {
    const communityDetails = this.appStateService.communityDetails;
    this.collabsDetails = communityDetails.find(item => item.id === 'collaboration') as ICommunityDetails;
    this.collabs = await this.appApiService.getHubCollabs().toPromise();
  }

  goToCollab(collab: ICollab) {
    const url = collab.link;
    if(isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

}
