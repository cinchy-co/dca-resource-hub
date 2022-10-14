import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ICommunityDetails} from "../../../models/general-values.model";
import {AppStateService} from "../../../services/app-state.service";
import {ApiCallsService} from "../../../services/api-calls.service";
import {CalendarEvents, IEvents} from "../model/hub.model";
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "../../../services/window-ref.service";
import {ICalendarEvent, NgAddToCalendarService} from "@trademe/ng-add-to-calendar";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Router} from "@angular/router";

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.scss']
})
export class LearningComponent implements OnInit {
  learningDetails: ICommunityDetails;
  events: IEvents[]
  eventsHeaderDetails: ICommunityDetails;
  googleCalendarEventUrl: SafeUrl;
  iCalendarEventUrl: SafeUrl;
  newEvent: ICalendarEvent;
  calendarEvents: CalendarEvents = {google: {}, apple: {}} as CalendarEvents;
  showGoogle: boolean;
  showZoom: boolean;

  constructor(private appStateService: AppStateService, private appApiService: ApiCallsService,
              @Inject(PLATFORM_ID) private platformId: any, private windowRef: WindowRefService,
              private addToCalendarService: NgAddToCalendarService, private sanitizer: DomSanitizer,
              private router: Router) {
  }

  async ngOnInit() {
    const communityDetails = this.appStateService.communityDetails;
    this.learningDetails = communityDetails.find(item => item.id === 'learning') as ICommunityDetails;
    this.events = await this.appApiService.getLearningEvents().toPromise();
    this.events.forEach(item => {
      const today = new Date();
      const [todayDate, todayMonth] = [today.getDate(), today.getMonth()];
      const eventDay = new Date(item.date);
      const [eventDate, eventMonth] = [eventDay.getDate(), eventDay.getMonth()];
      this.showZoom = todayDate === eventDate && todayMonth === eventMonth;
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
  }

  getCalendarEvent(event: IEvents) {
    return {
      // Event title
      title: event.title,
      // Event start date
      start: new Date(event.date),
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
    const id = option.id;
    this.router.navigate([`events/${id}`], {queryParams: {learning: true}});
    /*if(isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }*/
  }

}
