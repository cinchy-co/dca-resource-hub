import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {CalendarEvents, IEvents} from "../model/hub.model";
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
  newEvent: ICalendarEvent;
  calendarEvents: CalendarEvents = {google: {}, apple: {}} as CalendarEvents;
  showGoogle: boolean;

  constructor(private appApiService: ApiCallsService, private appStateService: AppStateService,
              @Inject(PLATFORM_ID) private platformId: any, private windowRef: WindowRefService,
              private addToCalendarService: NgAddToCalendarService, private sanitizer: DomSanitizer,
              private router: Router) {
  }

  async ngOnInit() {
    const communityDetails = this.appStateService.communityDetails;
    this.eventsHeaderDetails = communityDetails.find(item => item.id === 'events') as ICommunityDetails;
    this.events = await this.appApiService.getHubEvents().toPromise();
    this.events.forEach(item => {
      const calendarEvent = this.getCalendarEvent(item);
      const googleCalendarEventUrl = this.sanitizer.bypassSecurityTrustUrl(
        this.addToCalendarService.getHrefFor(this.addToCalendarService.calendarType.google, calendarEvent)
      );
      const iCalendarEventUrl = this.sanitizer.bypassSecurityTrustUrl(
        this.addToCalendarService.getHrefFor(this.addToCalendarService.calendarType.iCalendar, calendarEvent)
      );
      this.calendarEvents.google[item.title] = googleCalendarEventUrl;
      this.calendarEvents.apple[item.title] = iCalendarEventUrl;
    })
    this.showGoogle = this.windowRef.getOperatingSystem() === 'Windows';
    console.log('ppp events', this.events, this.calendarEvents, this.windowRef.getOperatingSystem())
  }

  getCalendarEvent(event: IEvents) {
    return {
      // Event title
      title: event.title,
      // Event start date
      start: new Date(event.date + ' ' + event.time),
      // Event duration (IN MINUTES)
      duration: event.duration,
      // If an end time is set, this will take precedence over duration (optional) end: new Date(event.date + ' ' + event.time),
      // Event Address (optional)
      address: event.zoomLink,
      // Event Description (optional)
      description: event.description
    };
  }

  goToSelection(option: IEvents) {
    console.log('111 option', option);
    const id = option.id;
    this.router.navigate([`events/${id}`]);
    /*if(isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }*/
  }

}
