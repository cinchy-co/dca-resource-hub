import {Component, OnInit} from '@angular/core';
import {IField, IFormField, IUser} from "../../models/common.model";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiCallsService} from "../../services/api-calls.service";
import {AppStateService} from "../../services/app-state.service";
import {ICommunityDetails} from "../../models/general-values.model";
import {ReplaySubject, takeUntil} from "rxjs";

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {
  userDetails: IUser;
  existingProfileDetails: any;
  allFields: IFormField[] = [];
  optionsForFields: any = {};
  profileHeaderDetails: ICommunityDetails;
  showLoader: boolean;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private apiService: ApiCallsService, private appStateService: AppStateService) {
  }

  async ngOnInit() {
    this.appStateService.getUserDetailsSub().pipe(takeUntil(this.destroyed$))
      .subscribe(async (userDetails: IUser) => {
        this.userDetails = userDetails;
        if (userDetails?.username) {
          this.existingProfileDetails = (await this.apiService.getProfileDetails(this.userDetails?.username).toPromise())[0];
          const communityDetails = this.appStateService.communityDetails;
          this.profileHeaderDetails = communityDetails.find(item => item.id === 'suggestions') as ICommunityDetails;
        }
      });
  }

  getPreSelectedValue(field: IFormField) {
    if (!field.options) {
      return this.existingProfileDetails[field.id];
    }

    let selectedOptions = field.options.filter(optionItem => this.existingProfileDetails[field.id]?.includes(optionItem.option));
    selectedOptions = selectedOptions?.length ? selectedOptions.map(item => item.cinchyId) : [];
    return selectedOptions;
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
