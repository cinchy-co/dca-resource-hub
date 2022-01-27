import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ApiCallsService} from "../../services/api-calls.service";
import {IAvatar, ILegislation, IOption} from "../../models/common.model";
import {RegionSearch, SearchBy} from "../../models/general-values.model";
import {WindowRefService} from "../../services/window-ref.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @Input() avatars: IAvatar[];
  legislationData: ILegislation[];
  filteredLegislationData: ILegislation[];
  autoCompleteOptions: ILegislation[];
  filteredAutoCompleteOptions: ILegislation[];
  paginatedLegislationData: ILegislation[];
  legislationVal: any;
  currentPage = 0;
  pageSize = 8;
  allKeys: (keyof ILegislation)[];
  searchByOptions: IOption[] = SearchBy;
  selectedSearchBy: IOption;
  selectedOption: IOption;
  selectedRegionSearchBy!: IOption | null;
  placeholderForSearch: string;
  showRegion: boolean;
  regionSearchBy = [RegionSearch];
  dropdownOptionStr: string;
  countrySelected: string;

  constructor(private apiCallsService: ApiCallsService, private windowRefService: WindowRefService) {
  }

  ngOnInit(): void {
    this.getLegislationData();
  }

  ngAfterViewInit() {
  }

  async getLegislationData() {
    this.legislationData = await this.apiCallsService.getLegislation().toPromise();
    this.filteredLegislationData = [...this.legislationData];
    this.setPaginateData();
    this.setKeys();
    this.searchByClicked({option: SearchBy[0]});
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

  setPaginateData() {
    const startPoint = this.currentPage * this.pageSize;
    const endPoint = startPoint + this.pageSize;
    this.paginatedLegislationData = [...this.filteredLegislationData].slice(startPoint, endPoint);
  }

  setKeys() {
    this.allKeys = (Object.keys(this.legislationData[0]) as (keyof ILegislation)[]).filter(
      keyItem => keyItem !== 'Summary' && keyItem !== 'Law' && keyItem !== 'Law Url'
    );
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
      this.filterLegislation(this.legislationVal);
      this.setPaginateData();
    }
  }

  itemSelected(event: ILegislation){
    const key = this.selectedOption.code as keyof ILegislation;
    this.dropdownOptionStr = event[key];
    this.filterLegislation(this.dropdownOptionStr);
    this.setPaginateData();
    let legislationDataPerCountry: ILegislation[] = this.legislationData.filter(item =>
      item.Country === this.dropdownOptionStr && item.Region);
    this.showRegion = (this.selectedOption.code === 'Country' && !!legislationDataPerCountry?.length)
      || this.selectedOption.code === 'Region';
    this.storeCountrySelected();
  }

  storeCountrySelected() {
    if (this.selectedSearchBy.code === 'Country' && this.selectedOption.code !== 'Region') {
      this.countrySelected = this.dropdownOptionStr;
    } else if (this.selectedOption.code !== 'Region') {
      this.countrySelected = '';
    }
  }

  filterLegislation(currentSearchByKeyVal: string) {
    this.filteredLegislationData = this.legislationData.filter(legislation => {
      const key = this.selectedOption.code as keyof ILegislation;
      return legislation[key]?.toLowerCase()?.indexOf(currentSearchByKeyVal.toLowerCase()) == 0;
    });
  }

  reset() {
    this.legislationVal = '';
    this.filteredLegislationData = [...this.legislationData];
    this.setPaginateData();
  }

  paginate(event: any) {
    this.currentPage = event.page;
    this.setPaginateData();
  }

}
