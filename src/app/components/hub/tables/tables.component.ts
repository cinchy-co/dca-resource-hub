import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ApiCallsService} from "../../../services/api-calls.service";
import {ITables} from "../model/hub.model";
import {ICommunityDetails} from "../../../models/general-values.model";
import {AppStateService} from "../../../services/app-state.service";
import {WindowRefService} from "../../../services/window-ref.service";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {
  tables: ITables[];
  toolsHeaderDetails: ICommunityDetails;

  constructor(private appApiService: ApiCallsService, private appStateService: AppStateService,
              private windowRef: WindowRefService, @Inject(PLATFORM_ID) private platformId: any) {
  }

  async ngOnInit() {
    const communityDetails = this.appStateService.communityDetails;
    this.toolsHeaderDetails = communityDetails.find(item => item.id === 'tables') as ICommunityDetails;
    this.tables = await this.appApiService.getHubTables().toPromise();
  }

  goToCinchyTable(item: ITables) {
    if(isPlatformBrowser(this.platformId)) {
      const url = item.tableLink
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

  goToMarketPlace() {
    const url = this.toolsHeaderDetails.buttonLink;
    if(isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

}
