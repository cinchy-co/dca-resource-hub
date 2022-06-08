import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IDropdownClick, ILegislation, IOption} from "../../models/common.model";
import {RegionSearch, SearchBy} from "../../models/general-values.model";
import {AppStateService} from "../../services/app-state.service";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-search-by-autocomplete',
  templateUrl: './search-by-autocomplete.component.html',
  styleUrls: ['./search-by-autocomplete.component.scss'],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(10px)'}),
        animate('500ms', style({opacity: 1, transform: 'translateY(0)'})),
      ]),
      transition(':leave', [
        animate('500ms', style({opacity: 0, transform: 'translateY(10px)'})),
      ]),
    ]),
  ]
})
export class SearchByAutocompleteComponent implements OnInit {
  @Input() searchByOptions: IOption[];
  @Input() resetOnChange = false;
  @Input() global = false;
  @Input() hideSearchByOptions = false;
  @Input() showSearchButton = false;
  @Input() placeholderOverride: string;
  @Input() label: string;
  @Input() set allDataForOptions(data: any) {
    if (this.resetOnChange) {
      this.resetComponent();
    }
    this._allData = data;
  };

  @Input() set tagsData(data: any) {
    if (this.resetOnChange) {
      this.resetComponent();
    }
    this._tagsData = data;
  }

  get tagsData() {
    return this._tagsData
  }

  get allDataForOptions() {
    return this._allData;
  }

  @Input() set preSelectedSearchBy(val: IOption) {
    this.searchByClicked({option: val});
  };

  @Input() set preSelectedDropdown(val: any) {
    this.searchByClicked({option:  this.selectedOption}, val);
  };

  @Output() optionClicked: EventEmitter<IDropdownClick> = new EventEmitter<IDropdownClick>();
  @Output() resetAll: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemSearched: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchBySelected: EventEmitter<any> = new EventEmitter<any>();

  private _allData: any;
  private _tagsData: any;
  filteredAutoCompleteOptions: any;
  autoCompleteOptions: any;
  selectedSearchBy: IOption;
  selectedOption: IOption;
  selectedRegionSearchBy!: IOption | null;
  oldSelectedOption: IOption;
  placeholderForSearch: string;
  showRegion: boolean;
  regionSearchBy = [RegionSearch];
  autoSearchVal: any;
  dropdownOptionStr: string;
  countrySelected: string;

  constructor(private appStateService: AppStateService) {
  }

  ngOnInit(): void {
  }

  searchByClicked(optionObj: { option: IOption }, preselectedDropdownStr?: string) {
    this.selectedOption = optionObj.option ? optionObj.option : this.selectedOption;
    const key = this.selectedOption.code;
    this.placeholderForSearch = this.selectedOption.name;
    if (!this.filteredAutoCompleteOptions || (this.oldSelectedOption.code !== this.selectedOption.code)) {
      if (this.selectedOption.code === 'Tags' && this.tagsData) {
        this.autoCompleteOptions = this.tagsData;
        this.filteredAutoCompleteOptions = this.tagsData;
      } else {
        const legislationData = this.getFilteredOptions(this.selectedOption);
        this.autoCompleteOptions = this.appStateService.getUniqueOptions(legislationData, this.selectedOption, this.global);
        this.filteredAutoCompleteOptions = this.autoCompleteOptions;
        this.selectedOption.code !== 'Tags' && this.filteredAutoCompleteOptions?.sort((a: any, b: any) => {
          return  a[key].localeCompare(b[key]);
        });
      }
    }
    this.oldSelectedOption = optionObj.option ? optionObj.option : this.selectedOption;

    this.searchBySelected.emit(this.selectedOption);
    if (preselectedDropdownStr) {
      this.autoSearchVal = this.autoCompleteOptions.find((item: any) => item[key].trim() === preselectedDropdownStr.trim());
    } else {
      this.reset();
    }
  }

  getFilteredOptions(option: IOption) {
    let dataPerCountry = this.allDataForOptions.filter((item: any) => item.Country === this.dropdownOptionStr);
    if (option.code === 'Region') {
      this.selectedRegionSearchBy = this.selectedOption;
      this.showRegion = !!dataPerCountry?.length;
    } else {
      this.selectedSearchBy = this.selectedOption;
      this.selectedRegionSearchBy = null;
      this.showRegion = false;
    }
    return this.showRegion ? [...dataPerCountry] : this.allDataForOptions;
  }

  filterAutoCompleteOptions(event: any) {
    let query = event.query;
    this.filteredAutoCompleteOptions = this.autoCompleteOptions.filter((item: any) => {
      const key = this.selectedRegionSearchBy ? (this.selectedRegionSearchBy.code)
        : this.selectedSearchBy.code;
      return item[key]?.toLowerCase().indexOf(query.toLowerCase()) == 0;
    });
  }

  itemSelected(event: any) {
    const key = this.selectedOption.code;
    this.dropdownOptionStr = event[key];
    let dataPerCountry = this.allDataForOptions.filter((item: any) =>
      item.Country === this.dropdownOptionStr && item.Region);
    this.showRegion = (this.selectedOption.code === 'Country' && !!dataPerCountry?.length)
      || this.selectedOption.code === 'Region';
    this.storeCountrySelected();
    this.optionClicked.emit({dropdownStr: this.dropdownOptionStr, countrySelected: this.countrySelected})
  }

  storeCountrySelected() {
    if (this.selectedSearchBy.code === 'Country' && this.selectedOption.code !== 'Region') {
      this.countrySelected = this.dropdownOptionStr;
    } else if (this.selectedOption.code !== 'Region') {
      this.countrySelected = '';
    }
  }

  search(event: any, isSearchClicked?:boolean) {
    if (event.code === 'Enter' || event.keyCode == 13 || isSearchClicked) {
      this.itemSearched.emit(this.autoSearchVal);
    }
  }

  reset() {
    this.autoSearchVal = null;
    this.resetAll.emit();
  }

  private resetComponent() {
    this.autoSearchVal = null;
    this.dropdownOptionStr = '';
    if (!this.hideSearchByOptions) {
      this.selectedSearchBy = {} as IOption;
      this.selectedOption = {} as IOption;
    }
  }

}
