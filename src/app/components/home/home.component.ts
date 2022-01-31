import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ApiCallsService} from "../../services/api-calls.service";
import {IAvatar, ILegislation, IOption} from "../../models/common.model";
import {RegionSearch, SearchBy} from "../../models/general-values.model";
import {animate, style, transition, trigger} from "@angular/animations";
import {AppStateService} from "../../services/app-state.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
      trigger('fadeSlideInOut', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          animate('500ms', style({ opacity: 1, transform: 'translateY(0)' })),
        ]),
        transition(':leave', [
          animate('500ms', style({ opacity: 0, transform: 'translateY(10px)' })),
        ]),
      ]),
  ]
})
export class HomeComponent implements OnInit {
  @Input() avatars: IAvatar[];
  legislationData: ILegislation[];
  autoCompleteOptions: ILegislation[];
  filteredAutoCompleteOptions: ILegislation[];
  legislationVal: any;
  allRegulatorKeys: any[];
  searchByOptions: IOption[] = SearchBy;
  selectedSearchBy: IOption;
  selectedOption: IOption;
  selectedRegionSearchBy!: IOption | null;
  placeholderForSearch: string;
  showRegion: boolean;
  regionSearchBy = [RegionSearch];
  dropdownOptionStr: string;
  countrySelected: string;
  regulatorData: any;
  newsFeedData: any;

  constructor(private apiCallsService: ApiCallsService, private appStateService: AppStateService) {
  }

  ngOnInit(): void {
    this.getLegislationData();
    this.getRegulatorData();
    this.getNewsFeed();
  }

  async getLegislationData() {
    this.legislationData = await this.apiCallsService.getLegislation().toPromise();
    this.searchByClicked({option: SearchBy[0]});
  }

  async getRegulatorData() {
    this.regulatorData = await this.apiCallsService.getPrivacyRegulators().toPromise();
  }

  async getNewsFeed() {
    this.newsFeedData = await this.apiCallsService.getPrivacyNewsFeed().toPromise();
  }

  searchByClicked(optionObj: {option: IOption}) {
    this.selectedOption = optionObj.option;
    const legislationData = this.getFilteredLegislationOptions(this.selectedOption);
    this.placeholderForSearch = this.selectedOption.name;
    const key = this.selectedOption.code as keyof ILegislation;
    const uniqueOptions = [...new Set(legislationData.map(item => {
      return item[key];
    }))];
    this.autoCompleteOptions = (uniqueOptions.filter(item => item)).map(optionItem => {
      const newDropdownList = {} as ILegislation;
      newDropdownList[key] = optionItem;
      return newDropdownList;
    });
    this.filteredAutoCompleteOptions = this.autoCompleteOptions;
    this.reset();
  }

  getFilteredLegislationOptions(option: IOption): ILegislation[] {
    let legislationDataPerCountry: ILegislation[] = this.legislationData.filter(item => item.Country === this.dropdownOptionStr);
    if (option.code === 'Region') {
      this.selectedRegionSearchBy = this.selectedOption;
      this.showRegion = !!legislationDataPerCountry?.length;
    } else {
      this.selectedSearchBy = this.selectedOption;
      this.selectedRegionSearchBy = null;
      this.showRegion = false;
    }
    return this.showRegion ? [...legislationDataPerCountry] : this.legislationData;
  }

  filterAutoCompleteOptions(event: any) {
    let query = event.query;
    this.filteredAutoCompleteOptions = this.autoCompleteOptions.filter(legislation => {
      const key = this.selectedRegionSearchBy ? (this.selectedRegionSearchBy.code as keyof ILegislation)
        : this.selectedSearchBy.code as keyof ILegislation;
      return legislation[key].toLowerCase().indexOf(query.toLowerCase()) == 0;
    });
  }

  search(event: any) {
    if (event.code === 'Enter') {
      this.appStateService.setSearch(this.legislationVal);
    }
  }

  itemSelected(event: ILegislation) {
    const key = this.selectedOption.code as keyof ILegislation;
    this.dropdownOptionStr = event[key];
    let legislationDataPerCountry: ILegislation[] = this.legislationData.filter(item =>
      item.Country === this.dropdownOptionStr && item.Region);
    this.showRegion = (this.selectedOption.code === 'Country' && !!legislationDataPerCountry?.length)
      || this.selectedOption.code === 'Region';
    this.storeCountrySelected();
    this.appStateService.setDropdownOption({dropdownStr: this.dropdownOptionStr, countrySelected: this.countrySelected});
  }

  storeCountrySelected() {
    if (this.selectedSearchBy.code === 'Country' && this.selectedOption.code !== 'Region') {
      this.countrySelected = this.dropdownOptionStr;
    } else if (this.selectedOption.code !== 'Region') {
      this.countrySelected = '';
    }
  }

  reset() {
    this.legislationVal = '';
    this.appStateService.setReset(true);
  }

}
