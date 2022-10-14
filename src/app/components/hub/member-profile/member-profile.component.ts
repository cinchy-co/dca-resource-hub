import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {ICommunityDetails} from "../../../models/general-values.model";
import {ApiCallsService} from "../../../services/api-calls.service";
import {AppStateService} from "../../../services/app-state.service";
import {WindowRefService} from "../../../services/window-ref.service";
import {ReplaySubject, takeUntil} from "rxjs";
import {IUser} from "../../../models/common.model";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.scss']
})
export class MemberProfileComponent implements OnInit, OnDestroy {
  details: ICommunityDetails;
  userDetails: IUser;
  cinchyProfileDetails: any;
  columns: string[];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);


  constructor(private appApiService: ApiCallsService, private appStateService: AppStateService,
              @Inject(PLATFORM_ID) private platformId: any, private windowRef: WindowRefService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.destroyed$)).subscribe(async (params: any) => {
      const memberId = params.get('id') as string;
      this.cinchyProfileDetails = (await this.appApiService.getMemberProfileDetails(memberId).toPromise())[0];
      this.columns = Object.keys(this.cinchyProfileDetails).filter(key => !key.includes('hidden'));
      const communityDetails = this.appStateService.communityDetails;
      this.details = communityDetails.find(item => item.id === 'member-profile') as ICommunityDetails;
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
