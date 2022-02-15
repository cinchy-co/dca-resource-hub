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
  @Input() hideSearchByOptions = false;
  @Input() set allDataForOptions(data: any) {
    if (this.resetOnChange) {
      this.resetComponent();
    }
    this._allData = data;
  };

  get allDataForOptions() {
    return this._allData;
  }

  @Input() set preSelectedSearchBy(val: IOption) {
    this.searchByClicked({option: val});
  };

  @Output() optionClicked: EventEmitter<IDropdownClick> = new EventEmitter<IDropdownClick>();
  @Output() resetAll: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemSearched: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchBySelected: EventEmitter<any> = new EventEmitter<any>();

  private _allData: any;
  filteredAutoCompleteOptions: any;
  autoCompleteOptions: any;
  selectedSearchBy: IOption;
  selectedOption: IOption;
  selectedRegionSearchBy!: IOption | null;
  placeholderForSearch: string;
  showRegion: boolean;
  regionSearchBy = [RegionSearch];
  autoSearchVal: string;
  dropdownOptionStr: string;
  countrySelected: string;

  constructor(private appStateService: AppStateService) {
  }

  ngOnInit(): void {
  }

  searchByClicked(optionObj: { option: IOption }) {
    this.selectedOption = optionObj.option;
    const legislationData = this.getFilteredOptions(this.selectedOption);
    this.placeholderForSearch = this.selectedOption.name;
    this.autoCompleteOptions = this.appStateService.getUniqueOptions(legislationData, this.selectedOption)
    this.filteredAutoCompleteOptions = this.autoCompleteOptions;
    this.searchBySelected.emit(this.selectedOption);
    this.reset();
  }

  getFilteredOptions(option: IOption): ILegislation[] {
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
      return item[key].toLowerCase().indexOf(query.toLowerCase()) == 0;
    });
  }

  itemSelected(event: ILegislation) {
    const key = this.selectedOption.code as keyof ILegislation;
    this.dropdownOptionStr = event[key];
    let dataPerCountry: ILegislation[] = this.allDataForOptions.filter((item: any) =>
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

  search(event: any) {
    if (event.code === 'Enter') {
      this.itemSearched.emit(this.autoSearchVal);
    }
  }

  reset() {
    this.autoSearchVal = '';
    this.resetAll.emit();
  }

  private resetComponent() {
    this.autoSearchVal = '';
    this.dropdownOptionStr = '';
    if (!this.hideSearchByOptions) {
      this.selectedSearchBy = {} as IOption;
      this.selectedOption = {} as IOption;
    }
  }

}
