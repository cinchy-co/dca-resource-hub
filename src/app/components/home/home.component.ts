import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ApiCallsService} from "../../services/api-calls.service";
import {IAvatar, IDropdownClick, ILegislation, IOption, ITag} from "../../models/common.model";
import {SearchBy} from "../../models/general-values.model";
import {AppStateService} from "../../services/app-state.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Input() avatars: IAvatar[];
  legislationData: ILegislation[];
  allRegulatorKeys: any[];
  searchByOptions: IOption[] = SearchBy;
  regulatorData: any;
  newsAndPodcastsData: any;
  searchVal: any; //
  selectedOption: IOption; //
  dropdownOptionStr: string; //
  countrySelected: string | undefined;//
  tags: ITag[];
  showError: boolean
  bannerDetails: any;

  constructor(private apiCallsService: ApiCallsService, private appStateService: AppStateService) {
  }

  async ngOnInit() {
    this.getLegislationData();
    this.getRegulatorData();
    this.getNewsAndPodcasts();
    this.getBannerDetails();
    this.avatars = await this.apiCallsService.getDataStewards().toPromise();
  }

  async getLegislationData() {
    this.legislationData = await this.apiCallsService.getLegislation().toPromise();
  }

  async getRegulatorData() {
    this.regulatorData = await this.apiCallsService.getPrivacyRegulators().toPromise();
  }

  async getNewsAndPodcasts() {
    try {
      this.tags = await this.apiCallsService.getTags().toPromise();
      this.newsAndPodcastsData = await this.apiCallsService.getNewsFeedAndPodcasts().toPromise();
      this.showError = false;
    } catch (e) {
      this.showError = true;
    }
  }

  async getBannerDetails() {
    this.bannerDetails = await this.apiCallsService.getHeaderBannerDetails().toPromise();
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
