import {Component, OnInit} from '@angular/core';
import {AppStateService} from "./services/app-state.service";
import {CinchyService} from "@cinchy-co/angular-sdk";
import {ApiCallsService} from "./services/api-calls.service";
import {IUser} from "./models/common.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dca-privacy-leg';
  isSidebarExpanded = true;
  loginDone: boolean;
  userDetails: IUser;

  constructor(private appStateService: AppStateService, private cinchyService: CinchyService,
              private apiCallsService: ApiCallsService) {
  }

  async ngOnInit() {
    this.cinchyService.checkIfSessionValid().toPromise().then((response: any) => {
      if (response.accessTokenIsValid) {
        this.setDetails();
      } else {
        this.cinchyService.login().then(success => {
          if (success) {
            this.setDetails();
          }
        }, error => {
          console.error('Could not login: ', error)
        });
      }
    })
  }

  async setDetails() {
    try {
      this.userDetails = await this.apiCallsService.setUserDetails();
      this.appStateService.userDetails = this.userDetails;
    } catch {
      console.error('No user details');
    }
    this.appStateService.communityDetails = await this.apiCallsService.getCommunityPageDetails().toPromise();
    this.loginDone = true;
  }

  sidebarStateChange(isExpanded: boolean) {
    this.isSidebarExpanded = isExpanded;
    this.appStateService.setSidebarToggled(isExpanded);
  }
}
