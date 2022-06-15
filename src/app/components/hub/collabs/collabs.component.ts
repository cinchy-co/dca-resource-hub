import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ICommunityDetails} from "../../../models/general-values.model";
import {AppStateService} from "../../../services/app-state.service";
import {ApiCallsService} from "../../../services/api-calls.service";
import {ICollab} from "../model/hub.model";
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "../../../services/window-ref.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-collabs',
  templateUrl: './collabs.component.html',
  styleUrls: ['./collabs.component.scss']
})
export class CollabsComponent implements OnInit {
  collabsDetails: ICommunityDetails;
  collabs: ICollab[];

  constructor(private appStateService: AppStateService, private appApiService: ApiCallsService,
              @Inject(PLATFORM_ID) private platformId: any, private windowRef: WindowRefService,
              private router: Router) { }

  async ngOnInit() {
    this.appStateService.setSidebarOption('');
    const communityDetails = this.appStateService.communityDetails;
    this.collabsDetails = communityDetails.find(item => item.id === 'collaboration') as ICommunityDetails;
    this.collabs = await this.appApiService.getHubCollabs().toPromise();
    this.appStateService.currentCollab = {} as ICollab;
  }

  goToCollab(collab: ICollab) {
    const url = collab.link;
    this.appStateService.currentCollab = collab;
    if (isPlatformBrowser(this.platformId) && url) {
      this.windowRef.nativeWindow.open(url, '_blank');
    } else {
      const route = collab.collabRoute;
      this.router.navigate([`${route}`]);
    }
  }

}
