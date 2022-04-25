import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ICommunityDetails} from "../../../models/general-values.model";
import {AppStateService} from "../../../services/app-state.service";
import {ApiCallsService} from "../../../services/api-calls.service";
import {IEvents} from "../model/hub.model";
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "../../../services/window-ref.service";

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.scss']
})
export class LearningComponent implements OnInit {
  learningDetails: ICommunityDetails;
  events: IEvents[]

  constructor(private appStateService: AppStateService, private appApiService: ApiCallsService,
              @Inject(PLATFORM_ID) private platformId: any, private windowRef: WindowRefService) { }

  async ngOnInit() {
    const communityDetails = this.appStateService.communityDetails;
    this.learningDetails = communityDetails.find(item => item.id === 'learning') as ICommunityDetails;
    this.events = await this.appApiService.getLearningEvents().toPromise();
    console.log('ppp events', this.events);
  }

  goToSelection(option: IEvents) {
    const url = option.rsvpLink;
    if(isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

}
