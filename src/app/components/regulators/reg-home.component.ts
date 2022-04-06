import {Component, Input, OnInit} from '@angular/core';
import {IAvatar, IDropdownClick, ILegislation, IOption, ITag, IWebsiteDetails} from "../../models/common.model";
import {ApiCallsService} from "../../services/api-calls.service";
import {AppStateService} from "../../services/app-state.service";
import {SearchBy} from "../../models/general-values.model";


@Component({
  selector: 'app-home',
  templateUrl: './reg-home.component.html',
  styleUrls: ['./reg-home.component.scss']
})
export class RegHomeComponent implements OnInit {
  @Input() avatars: IAvatar[];
  legislationData: ILegislation[];
  allRegulatorKeys: any[];
  searchByOptions: IOption[] = SearchBy;
  regulatorData: any;
  searchVal: any; //
  selectedOption: IOption; //
  dropdownOptionStr: string; //
  countrySelected: string | undefined;//
  tags: ITag[];
  showError: boolean
  bannerDetails: any;
  bannerDetailsPerRoute: IWebsiteDetails;

  constructor(private apiCallsService: ApiCallsService, private appStateService: AppStateService) {
  }

  async ngOnInit() {
    this.getLegislationData();
    this.getRegulatorData();
    this.getTags();
    this.getWebsiteDetails();
    this.getBannerDetailsPerRoute();
    this.avatars = await this.apiCallsService.getDataStewards().toPromise();
  }

  async getLegislationData() {
    this.legislationData = await this.apiCallsService.getLegislation().toPromise();
  }

  async getRegulatorData() {
    this.regulatorData = await this.apiCallsService.getPrivacyRegulators().toPromise();
  }

  async getTags() {
    this.tags = await this.apiCallsService.getTags().toPromise();
  }

  async getWebsiteDetails() {
    this.bannerDetails = await this.apiCallsService.getHeaderBannerDetails().toPromise();
  }

  async getBannerDetailsPerRoute() {
    this.bannerDetailsPerRoute = (await this.apiCallsService.getWebsiteDetails('privacy').toPromise())[0];
  }

  searchBySelected(option: IOption) {
    this.selectedOption = option;
  }

  itemSelectedInDropdown(data: IDropdownClick) {
    this.searchVal = data.dropdownStr;
    this.dropdownOptionStr = data.dropdownStr;
    this.countrySelected = data.countrySelected;
    this.appStateService.setDropdownOption(data);
  }

  itemSearched(val: string) {
    this.searchVal = val;
    this.appStateService.setSearch(val);
  }

  reset() {
    this.searchVal = '';
    this.appStateService.setReset(true);
  }

}
