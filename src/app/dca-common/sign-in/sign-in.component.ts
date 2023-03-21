import {Component, Input, OnInit} from '@angular/core';
import {ApiCallsService} from "../../services/api-calls.service";
import {AppStateService} from "../../services/app-state.service";
import {WindowRefService} from "../../services/window-ref.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  @Input() message: string;
  @Input() doRefresh: boolean;

  constructor(private appApiService: ApiCallsService, private appStateService: AppStateService,
              private windowRefService: WindowRefService) {
  }

  ngOnInit(): void {
  }

  login() {
    this.appStateService.setCurrentUrl();
    this.appApiService.login();
    if (this.doRefresh) {
      setTimeout(() => {
        this.windowRefService.nativeWindow.location.reload();
      }, 500)
    }
  }

}
