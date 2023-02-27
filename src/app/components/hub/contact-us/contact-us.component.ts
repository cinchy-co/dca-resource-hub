import { Component, OnInit } from '@angular/core';
import {ApiCallsService} from "../../../services/api-calls.service";
import {AppStateService} from "../../../services/app-state.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ICommunityDetails} from "../../../models/general-values.model";

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  isSignedIn: boolean;
  signInMessage = `Please sign in to submit an application.`;
  headerDetails: ICommunityDetails;

  constructor(private apiCallsService: ApiCallsService, private appStateService: AppStateService,
              private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.isSignedIn = this.apiCallsService.isSignedIn();
    const communityDetails = this.appStateService.communityDetails;
    this.headerDetails = communityDetails.find(item => item.id === 'submit-application') as ICommunityDetails;
  }

}
