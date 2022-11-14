import {Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {AppStateService} from "../../services/app-state.service";
import {IUser} from "../../models/common.model";
import {ConfigService} from "../../config.service";
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "../../services/window-ref.service";
import {CinchyService} from "@cinchy-co/angular-sdk";
import {ApiCallsService} from "../../services/api-calls.service";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() userDetails: IUser;
  @Input() isSidebarHidden: boolean;
  display: boolean;

  constructor(private appStateService: AppStateService, private configService: ConfigService,
              private windowRef: WindowRefService, @Inject(PLATFORM_ID) private platformId: any,
              private cinchyService: CinchyService, private apiService: ApiCallsService,
              private router: Router) {
  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId) && sessionStorage.getItem('is-logged-in')) {
      const userDetail = localStorage.getItem('hub-user-details') || '';
      this.appStateService.userDetails = userDetail ? JSON.parse(userDetail) : null;
      this.userDetails = this.userDetails ? this.userDetails : this.appStateService.userDetails;
      this.appStateService.setUserDetailsSub(this.appStateService.userDetails);
    }
    this.appStateService.getRoutingOnLogin().subscribe(val => {
      this.userDetails = this.userDetails ? this.userDetails : this.appStateService.userDetails;
    });
  }

  login() {
    this.appStateService.setCurrentUrl();
    this.apiService.login();
  }

  profileClicked() {
    this.display = true;
  }

  goToProfile() {
    this.display = false;
    this.router.navigate([`/profile`]);
  }

  signOut() {
    if (isPlatformBrowser(this.platformId)) {
      this.cinchyService.logout();
      this.apiService.logOut();
      localStorage.removeItem('hub-user-details');
      const url = `${this.configService.enviornmentConfig.cinchyRootUrl}/Account/Logoff`;
      const windowRef = this.windowRef.nativeWindow.open(url, '_blank');
      setTimeout(() => {
        windowRef.close();
        location.reload();
      }, 5000)
    }
  }

}
