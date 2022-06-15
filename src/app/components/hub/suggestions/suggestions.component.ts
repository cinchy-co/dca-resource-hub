import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ICommunityDetails} from "../../../models/general-values.model";
import {ApiCallsService} from "../../../services/api-calls.service";
import {AppStateService} from "../../../services/app-state.service";
import {FieldTypes, IField, IFormField} from "../../../models/common.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "../../../services/window-ref.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnInit {
  suggestionHeaderDetails: ICommunityDetails;
  allFields: IFormField[] = [];
  optionsForFields: any = {};
  suggestionForm: FormGroup;
  suggestionFormQueries: any;
  showLoader: boolean;

  constructor(private appApiService: ApiCallsService, private appStateService: AppStateService,
              private fb: FormBuilder, @Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService, private messageService: MessageService) {
  }

  async ngOnInit() {
    const communityDetails = this.appStateService.communityDetails;
    this.suggestionHeaderDetails = communityDetails.find(item => item.id === 'suggestions') as ICommunityDetails;
    this.suggestionFormQueries = (await this.appApiService.getSuggestionFormQueries('suggestions').toPromise())[0];
    this.setFieldAndOptions(this.suggestionFormQueries);
  }

  async setFieldAndOptions(suggestionFormQueries: any) {
    const {getQueryName, getQueryDomain, totalQueries} = suggestionFormQueries;
    const params = {
      '@pageId': 'suggestions'
    }
    const fields: IField[] = (await this.appApiService.executeCinchyQueries(getQueryName, getQueryDomain, params).toPromise());
    let startIndex = 1;
    while (startIndex <= totalQueries) {
      const linkQueryName = suggestionFormQueries[`optionQuery-${startIndex}`];
      const linkQueryDomain = suggestionFormQueries[`optionQueryDomain-${startIndex}`];
      const linkQueryLabel = suggestionFormQueries[`optionQueryLabel-${startIndex}`];
      const optionsList = (await this.appApiService.executeCinchyQueries(linkQueryName, linkQueryDomain).toPromise());
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
    this.suggestionForm = this.fb.group(this.getControls());
  }

  getControls() {
    const controls: any = {};
    this.allFields.forEach(field => {
      controls[field.id] = ['', [Validators.required]];
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
    try {
      this.showLoader = true;
      await this.appApiService.executeCinchyQueries(insertQueryName, insertQueryDomain, params, true).toPromise();
      this.suggestionForm.reset();
      this.suggestionForm.reset(this.suggestionForm.value);
      this.showLoader = false;
      this.messageService.add({severity:'success', summary:'Submit Successful', detail:'Your idea has been submitted'});
    } catch (e: any) {
      if (e?.cinchyException?.data?.status === 200) {
        this.showLoader = false;
        this.suggestionForm.reset(this.suggestionForm.value);
        this.suggestionForm.reset();
        this.messageService.add({severity:'success', summary:'Submit Successful', detail:'Your idea has been submitted'});
      } else {
        this.showLoader = false;
        this.messageService.add({severity:'error', summary:'Network error', detail:'Please try again after other time'});
      }
    }
  }

  goToSuggestions() {
    const url = this.suggestionHeaderDetails.buttonLink;
    if(isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

}
