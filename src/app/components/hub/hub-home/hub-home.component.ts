import { Component, OnInit } from '@angular/core';
import {ApiCallsService} from "../../../services/api-calls.service";
import {INewsFeed} from "../model/hub.model";

@Component({
  selector: 'app-hub-home',
  templateUrl: './hub-home.component.html',
  styleUrls: ['./hub-home.component.scss']
})
export class HubHomeComponent implements OnInit {
  newsFeed: INewsFeed[];

  constructor(private appApiService: ApiCallsService) { }

  async ngOnInit() {
    this.newsFeed = (await this.appApiService.getHubNewsfeed().toPromise()) as INewsFeed[];
  }

}
