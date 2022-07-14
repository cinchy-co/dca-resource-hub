import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {IEvents} from "../model/hub.model";
import {ICommunityDetails} from "../../../models/general-values.model";
import {ApiCallsService} from "../../../services/api-calls.service";
import {AppStateService} from "../../../services/app-state.service";
import {Router} from "@angular/router";
import {WindowRefService} from "../../../services/window-ref.service";
import {isPlatformBrowser} from "@angular/common";
import {ICalendarEvent, NgAddToCalendarService } from '@trademe/ng-add-to-calendar';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  events: IEvents[];
  eventsHeaderDetails: ICommunityDetails;
  googleCalendarEventUrl: SafeUrl;
  iCalendarEventUrl: SafeUrl;
  outlookCalendarEventUrl: SafeUrl;
  newEvent: ICalendarEvent;

  constructor(private appApiService: ApiCallsService, private appStateService: AppStateService,
              @Inject(PLATFORM_ID) private platformId: any, private windowRef: WindowRefService,
              private addToCalendarService: NgAddToCalendarService, private sanitizer: DomSanitizer) {
    this.newEvent = {
      // Event title
      title: 'My event title',
      // Event start date
      start: new Date('June 15, 2013 19:00'),
      // Event duration (IN MINUTES)
      duration: 120,
      // If an end time is set, this will take precedence over duration (optional)
      end: new Date('June 15, 2013 23:00'),
      // Event Address (optional)
      address: '1 test street, testland',
      // Event Description (optional)
      description: 'An awesome event'
    };
    this.googleCalendarEventUrl = this.sanitizer.bypassSecurityTrustUrl(
      this.addToCalendarService.getHrefFor(this.addToCalendarService.calendarType.google, this.newEvent)
    );

    this.iCalendarEventUrl = this.sanitizer.bypassSecurityTrustUrl(
      this.addToCalendarService.getHrefFor(this.addToCalendarService.calendarType.iCalendar, this.newEvent)
    );

    this.outlookCalendarEventUrl = this.sanitizer.bypassSecurityTrustUrl(
      this.addToCalendarService.getHrefFor(this.addToCalendarService.calendarType.outlook, this.newEvent)
    );
    console.log('1111 CALENDARD', this.iCalendarEventUrl, this.outlookCalendarEventUrl, this.googleCalendarEventUrl)
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
