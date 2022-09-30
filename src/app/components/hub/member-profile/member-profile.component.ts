import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {ICommunityDetails} from "../../../models/general-values.model";
import {ApiCallsService} from "../../../services/api-calls.service";
import {AppStateService} from "../../../services/app-state.service";
import {WindowRefService} from "../../../services/window-ref.service";
import {ReplaySubject, takeUntil} from "rxjs";
import {IUser} from "../../../models/common.model";

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.scss']
})
export class MemberProfileComponent implements OnInit, OnDestroy {
  details: ICommunityDetails;
  userDetails: IUser;
  cinchyProfileDetails: any;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);


  constructor(private appApiService: ApiCallsService, private appStateService: AppStateService,
              @Inject(PLATFORM_ID) private platformId: any, private windowRef: WindowRefService) { }

  ngOnInit(): void {
    this.appStateService.getUserDetailsSub().pipe(takeUntil(this.destroyed$))
      .subscribe(async (userDetails: IUser) => {
        this.userDetails = userDetails;
        if (userDetails?.username) {
          this.cinchyProfileDetails = (await this.appApiService.getMemberProfileDetails(this.userDetails?.username).toPromise())[0];
          console.log('111 CINCHY', this.cinchyProfileDetails);
          const communityDetails = this.appStateService.communityDetails;
          this.details = communityDetails.find(item => item.id === 'member-profile') as ICommunityDetails;
        }
      });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
