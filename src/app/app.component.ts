import {Component, OnInit} from '@angular/core';
import {ApiCallsService} from "./services/api-calls.service";
import {IAvatar} from "./models/common.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'dca-privacy-leg';

  avatars: IAvatar[];

  constructor(private apiCallsService: ApiCallsService) {
  }

  async ngOnInit() {
    this.avatars = await this.apiCallsService.getDataStewards().toPromise();
  }
}
