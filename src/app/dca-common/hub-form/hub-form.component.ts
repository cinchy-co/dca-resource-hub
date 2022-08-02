import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {IField, IFormField, IUser} from "../../models/common.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ReplaySubject} from "rxjs";
import {ApiCallsService} from "../../services/api-calls.service";
import {AppStateService} from "../../services/app-state.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-hub-form',
  templateUrl: './hub-form.component.html',
  styleUrls: ['./hub-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubFormComponent implements OnInit {
  @Input() userDetails: IUser;
  @Input() formId: string;
  @Input() buttonLabel: string;
  @Input() successMessage = 'Your changes has been done';
  @Input() existingDetails: any;
  @Input() topSpaceToButton: string;
  @Input() updateWithHiddenOrDisabledFields: boolean;
  @Input() doAutoFocus: boolean;

  @Output() submitClicked: EventEmitter<any> = new EventEmitter<any>();

  allFields: IFormField[] = [];
  optionsForFields: any = {};
  customForm: FormGroup;
  customFormQueries: any;
  showLoader: boolean;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  @ViewChild("autoFocusInput") autoFocusInput: ElementRef;

  constructor(private apiService: ApiCallsService, private fb: FormBuilder, private appStateService: AppStateService,
              private messageService: MessageService, private changeDetectionRef: ChangeDetectorRef) {
  }

  async ngOnInit() {
    this.customFormQueries = (await this.apiService.getSuggestionFormQueries(this.formId).toPromise())[0];
    this.setFieldAndOptions(this.customFormQueries);
  }

  async setFieldAndOptions(customFormQueries: any) {
    const {getQueryName, getQueryDomain, totalQueries} = customFormQueries;
    const params = {
      '@pageId': this.formId
    }
    const fields: IField[] = (await this.apiService.executeCinchyQueries(getQueryName, getQueryDomain, params).toPromise());
    let startIndex = 1;
    while (startIndex <= totalQueries) {
      const linkQueryName = customFormQueries[`optionQuery-${startIndex}`];
      const linkQueryDomain = customFormQueries[`optionQueryDomain-${startIndex}`];
      const linkQueryLabel = customFormQueries[`optionQueryLabel-${startIndex}`];
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
          isTextOnly: field.isTextOnly === 'Yes',
          width: field.width,
          isHidden: field.isHidden === 'Yes',
        };
        this.allFields.push(item)
      }
    });
    this.createForm();
    if (this.doAutoFocus) {
      setTimeout(() => {
        this.autoFocusInput.nativeElement.focus();
      }, 100);
    }
  }

  createForm() {
    this.customForm = this.fb.group(this.getControls());
    this.changeDetectionRef.detectChanges();
  }

  getControls() {
    const controls: any = {};
    this.allFields.forEach(field => {
      if (!field.isTextOnly) {
        controls[field.id] = [{
          value: this.existingDetails ? this.getPreSelectedValue(field) : '',
          disabled: field.isDisabled
        }];
      }
    });
    return controls;
  }

  getPreSelectedValue(field: IFormField) {
    if (!field.options) {
      return this.existingDetails[field.id];
    }

    let selectedOptions = field.options.filter(optionItem => this.existingDetails[field.id]?.includes(optionItem.option));
    selectedOptions = selectedOptions?.length ? selectedOptions.map(item => item.cinchyId) : [];
    return selectedOptions;
  }

  async submit() {
    if (!this.customForm.valid) {
      return;
    }

    const {insertQueryName, insertQueryDomain} = this.customFormQueries;
    const formValues = this.updateWithHiddenOrDisabledFields ? this.customForm.getRawValue() : this.customForm.value;
    const allFormKeys = Object.keys(formValues);
    const params: any = {};
    allFormKeys.forEach(key => {
      params[`@${key}`] = Array.isArray(formValues[key]) ?
        formValues[key].length ? `${formValues[key].join(',1,')},1` : '' : formValues[key]
    });
    if (this.userDetails) {
      params['@username'] = this.userDetails.username;
    }
    this.showLoader = true;
    try {
      await this.apiService.executeCinchyQueries(insertQueryName, insertQueryDomain, params, true).toPromise();
      this.submitClicked.emit(formValues);
      this.showLoader = false;
      this.customForm.reset();
      this.customForm.reset(this.customForm.value);
      this.messageService.add({
        severity: 'success',
        summary: 'Submit Successful',
        detail: this.successMessage
      });
      this.changeDetectionRef.detectChanges();
    } catch (e: any) {
      this.handleError(e, formValues);
    }
  }

  handleError(e: any, formValues: any) {
    if (e?.cinchyException?.data?.status === 200) {
      this.showLoader = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Submit Successful',
        detail: this.successMessage
      });
      this.submitClicked.emit(formValues);
      this.showLoader = false;
      this.customForm.reset();
      this.customForm.reset(this.customForm.value);
      this.changeDetectionRef.detectChanges();
    } else {
      this.showLoader = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Network error',
        detail: 'Please try again after other time'
      });
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }


}
