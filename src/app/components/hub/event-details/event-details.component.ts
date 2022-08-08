import { Component, OnInit } from '@angular/core';
import {ApiCallsService} from "../../../services/api-calls.service";
import {AppStateService} from "../../../services/app-state.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  currentEventId: string;

  constructor(private apiCallsService: ApiCallsService, private appStateService: AppStateService,
              private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.currentEventId = this.activatedRoute.snapshot.paramMap.get('id') as string;

  }

}
