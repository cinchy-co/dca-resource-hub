import {Component, Input, OnInit} from '@angular/core';
import {ApiCallsService} from "../../services/api-calls.service";
import {AppStateService} from "../../services/app-state.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  @Input() message: string;

  constructor(private appApiService: ApiCallsService, private appStateService: AppStateService) { }

  ngOnInit(): void {
  }

  login() {
    this.appStateService.setCurrentUrl();
    this.appApiService.login();
  }

}
