import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {IEvents} from "../model/hub.model";
import {ICommunityDetails} from "../../../models/general-values.model";
import {ApiCallsService} from "../../../services/api-calls.service";
import {AppStateService} from "../../../services/app-state.service";
import {Router} from "@angular/router";
import {WindowRefService} from "../../../services/window-ref.service";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  events: IEvents[];
  eventsHeaderDetails: ICommunityDetails;

  constructor(private appApiService: ApiCallsService, private appStateService: AppStateService,
              @Inject(PLATFORM_ID) private platformId: any, private windowRef: WindowRefService) {
  }

  async ngOnInit() {
    const communityDetails = this.appStateService.communityDetails;
    this.eventsHeaderDetails = communityDetails.find(item => item.id === 'events') as ICommunityDetails;
    this.events = await this.appApiService.getHubEvents().toPromise();
    console.log('ppp events', this.events)
  }

  goToSelection(option: IEvents) {
    const url = option.rsvpLink;
    if(isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

}
