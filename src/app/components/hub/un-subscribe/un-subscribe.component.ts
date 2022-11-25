import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ICommunityDetails} from "../../../models/general-values.model";
import {ApiCallsService} from "../../../services/api-calls.service";
import {AppStateService} from "../../../services/app-state.service";
import {WindowRefService} from "../../../services/window-ref.service";

@Component({
  selector: 'app-un-subscribe',
  templateUrl: './un-subscribe.component.html',
  styleUrls: ['./un-subscribe.component.scss']
})
export class UnSubscribeComponent implements OnInit {
  headerDetails: ICommunityDetails;

  constructor(private appApiService: ApiCallsService, private appStateService: AppStateService,
              private windowRef: WindowRefService, @Inject(PLATFORM_ID) private platformId: any) { }

  ngOnInit(): void {
    const communityDetails = this.appStateService.communityDetails;
    this.headerDetails = communityDetails.find(item => item.id === 'unsubscribe') as ICommunityDetails;
  }

}
