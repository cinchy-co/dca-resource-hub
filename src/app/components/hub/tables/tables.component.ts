import { Component, OnInit } from '@angular/core';
import {ApiCallsService} from "../../../services/api-calls.service";
import {ITables} from "../model/hub.model";
import {ICommunityDetails} from "../../../models/general-values.model";
import {AppStateService} from "../../../services/app-state.service";

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {
  tables: ITables[];
  toolsHeaderDetails: ICommunityDetails;

  constructor(private appApiService: ApiCallsService, private appStateService: AppStateService) {
  }

  async ngOnInit() {
    const communityDetails = this.appStateService.communityDetails;
    this.toolsHeaderDetails = communityDetails.find(item => item.id === 'tables') as ICommunityDetails;
    this.tables = await this.appApiService.getHubTables().toPromise();
    console.log('ppp this.tools', this.tables);
  }

}
