import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ApiCallsService} from "../../../services/api-calls.service";
import {ITools} from "../model/hub.model";
import {AppStateService} from "../../../services/app-state.service";
import {ICommunityDetails} from "../../../models/general-values.model";
import {Router} from "@angular/router";
import {WindowRefService} from "../../../services/window-ref.service";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {
  tools: ITools[];
  toolsHeaderDetails: ICommunityDetails;

  constructor(private appApiService: ApiCallsService, private appStateService: AppStateService,
              private router: Router, @Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService) {
  }

  async ngOnInit() {
    const communityDetails = this.appStateService.communityDetails;
    this.toolsHeaderDetails = communityDetails.find(item => item.id === 'tools') as ICommunityDetails;
    this.tools = await this.appApiService.getHubTools().toPromise();
  }

  goToSelection(item: ITools) {
    this.appStateService.currentToolSelected = item;
    if (item.externalLink && isPlatformBrowser(this.platformId)) {
      const url = item.externalLink;
      console.log('1111 url', url);
      this.windowRef.nativeWindow.open(url, '_blank');
      return;
    }
    this.router.navigate([`apps/${item.toolRoute}`]);
  }

}
