import {Component, OnInit} from '@angular/core';
import {AppStateService} from "./services/app-state.service";
import {CinchyService} from "@cinchy-co/angular-sdk";
import {ApiCallsService} from "./services/api-calls.service";
import {ICommunityDetails} from "./models/general-values.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dca-privacy-leg';
  isSidebarExpanded: boolean;
  loginDone: boolean;

  constructor(private appStateService: AppStateService, private cinchyService: CinchyService,
              private apiCallsService: ApiCallsService) {
  }

  async ngOnInit() {
    this.cinchyService.checkIfSessionValid().toPromise().then((response: any) => {
      if (response.accessTokenIsValid) {
        this.getCommunityPageDetails();
      } else {
        this.cinchyService.login().then(success => {
          if (success) {
            this.getCommunityPageDetails();
          }
        }, error => {
          console.error('Could not login: ', error)
        });
      }
    })
  }

  async getCommunityPageDetails() {
    const communityDetails = await this.apiCallsService.getCommunityPageDetails().toPromise();
    console.log('COMMUNITY DETAILS', communityDetails);
    this.appStateService.communityDetails = communityDetails;
    this.loginDone = true;
  }

  sidebarStateChange(isExpanded: boolean) {
    this.isSidebarExpanded = isExpanded;
    this.appStateService.setSidebarToggled(isExpanded);
  }
}
