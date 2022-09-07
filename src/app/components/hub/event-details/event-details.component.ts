import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiCallsService} from "../../../services/api-calls.service";
import {AppStateService} from "../../../services/app-state.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ReplaySubject, takeUntil} from "rxjs";
import {IUser} from "../../../models/common.model";
import {IEvents} from "../model/hub.model";

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit, OnDestroy {
  currentEventId: string;
  userDetails: IUser;
  events: IEvents[];
  currentEvent: IEvents;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);


  constructor(private apiCallsService: ApiCallsService, private appStateService: AppStateService,
              private activatedRoute: ActivatedRoute, private router: Router) {
  }

  async ngOnInit() {
    this.currentEventId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.events = await this.apiCallsService.getHubEvents().toPromise();
    this.currentEvent = this.events.find(event => event.id == this.currentEventId) as IEvents;
    this.appStateService.getUserDetailsSub().pipe(takeUntil(this.destroyed$))
      .subscribe(async (userDetails: IUser) => {
        this.userDetails = userDetails;
      });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
