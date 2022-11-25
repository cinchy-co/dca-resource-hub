import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ApiCallsService} from "../../../services/api-calls.service";
import {AppStateService} from "../../../services/app-state.service";
import {ICommunityDetails} from "../../../models/general-values.model";
import {WindowRefService} from "../../../services/window-ref.service";



@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {
  headerDetails: ICommunityDetails;


  constructor(private appApiService: ApiCallsService, private appStateService: AppStateService,
              private windowRef: WindowRefService, @Inject(PLATFORM_ID) private platformId: any) { }

  ngOnInit(): void {
    const communityDetails = this.appStateService.communityDetails;
    this.headerDetails = communityDetails.find(item => item.id === 'subscribe') as ICommunityDetails;
  }

}
