import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ICommunityDetails} from "../../../models/general-values.model";
import {ApiCallsService} from "../../../services/api-calls.service";
import {AppStateService} from "../../../services/app-state.service";
import {FieldTypes} from "../../../models/common.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "../../../services/window-ref.service";

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnInit {
  suggestionHeaderDetails: ICommunityDetails;
  allFields: { label: string, type?: FieldTypes, options?: any[] }[] = [];
  optionsForFields: any = {};
  suggestionForm: FormGroup;
  suggestionFormQueries: any;

  constructor(private appApiService: ApiCallsService, private appStateService: AppStateService,
              private fb: FormBuilder, @Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService) {
  }

  async ngOnInit() {
    const communityDetails = this.appStateService.communityDetails;
    this.suggestionHeaderDetails = communityDetails.find(item => item.id === 'suggestions') as ICommunityDetails;
    this.suggestionFormQueries = (await this.appApiService.getSuggestionFormQueries().toPromise())[0];
    this.setFieldAndOptions(this.suggestionFormQueries);
  }

  async setFieldAndOptions(suggestionFormQueries: any) {
    const {getQueryName, getQueryDomain, totalQueries} = suggestionFormQueries;
    const fields = (await this.appApiService.executeCinchyQueries(getQueryName, getQueryDomain).toPromise())[0];
    const allKeys = Object.keys(fields);
    let startIndex = 1;
    while (startIndex <= totalQueries) {
      const linkQueryName = suggestionFormQueries[`optionQuery-${startIndex}`];
      const linkQueryDomain = suggestionFormQueries[`optionQueryDomain-${startIndex}`];
      const linkQueryLabel = suggestionFormQueries[`optionQueryLabel-${startIndex}`];
      const optionsList = (await this.appApiService.executeCinchyQueries(linkQueryName, linkQueryDomain).toPromise());
      this.optionsForFields[`${linkQueryLabel}-Label`] = optionsList;
      startIndex++;
    }
    allKeys.forEach(key => {
      if (key.includes('Label')) {
        const item = {label: fields[key], options: this.optionsForFields[key]};
        this.allFields.push(item)
      }
    });
    this.createForm();
  }

  createForm() {
    this.suggestionForm = this.fb.group(this.getControls());
  }

  getControls() {
    const controls: any = {};
    this.allFields.forEach(field => {
      controls[field.label] = ['', [Validators.required]];
    })
    return controls;
  }

  async submit() {
    if(!this.suggestionForm.valid) {return ;}

    const {insertQueryName, insertQueryDomain} = this.suggestionFormQueries;
    const formValues = this.suggestionForm.value;
    const allFormKeys = Object.keys(formValues);
    const params: any = {};
    allFormKeys.forEach(key => {
      params[`@${key}`] = formValues[key];
    });
    await this.appApiService.executeCinchyQueries(insertQueryName, insertQueryDomain, params).toPromise();
  }

  goToSuggestions() {
    const url = this.suggestionHeaderDetails.buttonLink;
    if(isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

}
