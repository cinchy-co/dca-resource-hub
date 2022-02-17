import {Component, OnInit} from '@angular/core';
import {ApiCallsService} from "./services/api-calls.service";
import {IAvatar} from "./models/common.model";
import {AppStateService} from "./services/app-state.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'dca-privacy-leg';


  constructor() {
  }

  async ngOnInit() {
  }
}
