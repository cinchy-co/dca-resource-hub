import { Component, OnInit } from '@angular/core';
import {IField, IFormField, IUser} from "../../models/common.model";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiCallsService} from "../../services/api-calls.service";
import {AppStateService} from "../../services/app-state.service";
import {ICommunityDetails} from "../../models/general-values.model";
import {MessageService} from "primeng/api";
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
  profileForm: FormGroup;
  profileFormQueries: any;
  profileHeaderDetails: ICommunityDetails;
  showLoader: boolean;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private apiService: ApiCallsService, private fb: FormBuilder, private appStateService: AppStateService,
              private messageService: MessageService) { }

  async ngOnInit() {
    this.appStateService.getUserDetailsSub().pipe(takeUntil(this.destroyed$))
      .subscribe(async (userDetails: IUser) => {
      this.userDetails = userDetails;
      if (userDetails?.username) {
        this.existingProfileDetails = (await this.apiService.getProfileDetails(this.userDetails?.username).toPromise())[0];
        this.profileFormQueries = (await this.apiService.getSuggestionFormQueries('profile').toPromise())[0];
        this.setFieldAndOptions(this.profileFormQueries);
        const communityDetails = this.appStateService.communityDetails;
        this.profileHeaderDetails = communityDetails.find(item => item.id === 'suggestions') as ICommunityDetails;
      }
    });
  }

  async setFieldAndOptions(profileFormQueries: any) {
    const {getQueryName, getQueryDomain, totalQueries} = profileFormQueries;
    const fields: IField[] = (await this.apiService.executeCinchyQueries(getQueryName, getQueryDomain).toPromise());
    let startIndex = 1;
    while (startIndex <= totalQueries) {
      const linkQueryName = profileFormQueries[`optionQuery-${startIndex}`];
      const linkQueryDomain = profileFormQueries[`optionQueryDomain-${startIndex}`];
      const linkQueryLabel = profileFormQueries[`optionQueryLabel-${startIndex}`];
      const optionsList = (await this.apiService.executeCinchyQueries(linkQueryName, linkQueryDomain).toPromise());
      this.optionsForFields[`${linkQueryLabel}-Label`] = optionsList;
      startIndex++;
    }
    fields.forEach(field => {
      if (field.label.includes('Label') || field.label.includes('label')) {
        const item = {
          label: field.title,
          id: field.label.split('-')[0],
          options: this.optionsForFields[field.label],
          isMultiple: field.isMultiple === 'Yes',
          isCheckbox: field.isCheckbox === 'Yes',
          isDisabled: field.isDisabled === 'Yes',
          isTextArea: field.isTextArea === 'Yes',
          width: field.width
        };
        this.allFields.push(item)
      }
    });
    this.createForm();
  }

  createForm() {
    this.profileForm = this.fb.group(this.getControls());
  }

  getControls() {
    const controls: any = {};
    this.allFields.forEach(field => {
      controls[field.id] = [{value: this.getPreSelectedValue(field), disabled: field.isDisabled}];
    });
    return controls;
  }

  getPreSelectedValue(field: IFormField) {
    if (!field.options) {
      return this.existingProfileDetails[field.id];
    }

    let selectedOptions = field.options.filter(optionItem => this.existingProfileDetails[field.id]?.includes(optionItem.option));
    selectedOptions = selectedOptions?.length ? selectedOptions.map(item => item.cinchyId) : [];
    return selectedOptions;
  }

  async submit() {
    if(!this.profileForm.valid) {return ;}

    const {insertQueryName, insertQueryDomain} = this.profileFormQueries;
    const formValues = this.profileForm.value;
    const allFormKeys = Object.keys(formValues);
    const params: any = {};
    allFormKeys.forEach(key => {
      params[`@${key}`] = Array.isArray(formValues[key]) ? `${formValues[key].join(',1,')},1` : formValues[key]
    });
    params['@username'] = this.userDetails.username;
    try {
      this.showLoader = true;
      await this.apiService.executeCinchyQueries(insertQueryName, insertQueryDomain, params, true).toPromise();
      this.showLoader = false;
      this.messageService.add({severity:'success', summary:'Submit Successful', detail:'Your Profile has been updated'});
    } catch (e: any) {
      if (e?.cinchyException?.data?.status === 200) {
        this.showLoader = false;
        this.messageService.add({severity:'success', summary:'Submit Successful', detail:'Your Profile has been updated'});
      } else {
        this.showLoader = false;
        this.messageService.add({severity:'error', summary:'Network error', detail:'Please try again after other time'});
      }
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
