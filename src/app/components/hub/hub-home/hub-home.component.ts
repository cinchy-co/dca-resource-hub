import { Component, OnInit } from '@angular/core';
import {ApiCallsService} from "../../../services/api-calls.service";
import {INewsFeed} from "../model/hub.model";
import {AppStateService} from "../../../services/app-state.service";
import {IFooter, ISocialMedia, IUser} from "../../../models/common.model";

@Component({
  selector: 'app-hub-home',
  templateUrl: './hub-home.component.html',
  styleUrls: ['./hub-home.component.scss']
})
export class HubHomeComponent implements OnInit {
  newsFeed: INewsFeed[];
  userDetails: IUser;
  footerDetails: IFooter[];
  socialMediaDetails: ISocialMedia[];

  constructor(private appApiService: ApiCallsService, private appStateService: AppStateService) { }

  async ngOnInit() {
    this.userDetails = this.appStateService.userDetails;
    this.socialMediaDetails = (await this.appApiService.getSocialMediaDetails().toPromise());
    this.footerDetails = this.appStateService.footerDetails;
    this.newsFeed = (await this.appApiService.getHubNewsfeed().toPromise()) as INewsFeed[];
  }

}
