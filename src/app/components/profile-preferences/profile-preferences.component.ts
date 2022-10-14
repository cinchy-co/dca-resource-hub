import {Component, OnInit} from '@angular/core';
import {IFormField, IUser} from "../../models/common.model";
import {ICommunityDetails} from "../../models/general-values.model";
import {ReplaySubject, takeUntil} from "rxjs";
import {ApiCallsService} from "../../services/api-calls.service";
import {AppStateService} from "../../services/app-state.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-profile-preferences',
  templateUrl: './profile-preferences.component.html',
  styleUrls: ['./profile-preferences.component.scss']
})
export class ProfilePreferencesComponent implements OnInit {
  userDetails: IUser;
  existingProfileDetails: any;
  allFields: IFormField[] = [];
  optionsForFields: any = {};
  profileHeaderDetails: ICommunityDetails;
  showLoader: boolean;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private apiService: ApiCallsService, private appStateService: AppStateService,
              private messageService: MessageService) {
  }

  async ngOnInit() {
    this.appStateService.getUserDetailsSub().pipe(takeUntil(this.destroyed$))
      .subscribe(async (userDetails: IUser) => {
        this.userDetails = userDetails;
        if (userDetails?.username) {
          this.existingProfileDetails = (await this.apiService.getProfileDetails(this.userDetails?.username).toPromise())[0];
          const communityDetails = this.appStateService.communityDetails;
          this.profileHeaderDetails = communityDetails.find(item => item.id === 'preferences') as ICommunityDetails;
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

  fileSelected(imageInput: any) {
    const file: File = imageInput.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', async (event: any) => {
      const base64Image = event.target.result;
      try {
        await this.apiService.updateProfilePhoto(this.existingProfileDetails.photo, this.userDetails.username).toPromise();
        this.existingProfileDetails.photo = base64Image.split('base64,')[1];
      }
      catch (e) {
        this.messageService.add({
          severity: 'error',
          summary: 'Network error',
          detail: 'Please try again after other time'
        });
      }
    });
    reader.readAsDataURL(file);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
