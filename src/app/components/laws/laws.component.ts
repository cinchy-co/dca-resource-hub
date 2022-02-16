import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IDropdownClick, ILegislation, IOption} from "../../models/common.model";
import {AppStateService} from "../../services/app-state.service";
import {ReplaySubject, takeUntil} from "rxjs";
import {PAGE_SIZE, SearchByLaw} from "../../models/general-values.model";

@Component({
  selector: 'app-laws',
  templateUrl: './laws.component.html',
  styleUrls: ['./laws.component.scss']
})
export class LawsComponent implements OnInit, OnDestroy {
  @Input() legislationData: ILegislation[];
  @Input() selectedOption: IOption;
  @Input() isCountrySelected: boolean;
  childSelectedOption: IOption;
  filteredLegislationData: ILegislation[];
  paginatedLegislationData: ILegislation[];
  currentPage = 0;
  pageSize = PAGE_SIZE - 2;
  allKeys: (keyof ILegislation)[];
  searchByOptions: IOption[] = SearchByLaw;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  childFilteredData: ILegislation[];

  constructor(private appStateService: AppStateService) {
  }

  ngOnInit(): void {
    this.filteredLegislationData = [...this.legislationData];
    this.childFilteredData = [...this.legislationData];
    this.setPaginateData();
    this.setKeys();
    this.subscribeToStateChanges();
  }

  subscribeToStateChanges() {
    this.appStateService.getSearchEnteredVal().pipe(takeUntil(this.destroyed$)).subscribe(searchVal => {
      this.filterLegislation(searchVal);
    });

    this.appStateService.getDropdownOption().pipe(takeUntil(this.destroyed$)).subscribe(({dropdownStr, countrySelected}) => {
        this.filterLegislation(dropdownStr);
      });

    this.appStateService.getReset().pipe(takeUntil(this.destroyed$)).subscribe(isReset => {
      this.reset();
    });
  }

  setPaginateData() {
    const startPoint = this.currentPage * this.pageSize;
    const endPoint = startPoint + this.pageSize;
    this.paginatedLegislationData = [...this.filteredLegislationData].slice(startPoint, endPoint);
  }

  setKeys() {
    this.allKeys = (Object.keys(this.legislationData[0]) as (keyof ILegislation)[]).filter(
      keyItem => keyItem !== 'Summary' && keyItem !== 'Law' && keyItem !== 'Law Url' && keyItem !== 'Combined Country'
    );
  }

  filterLegislation(currentSearchByKeyVal: string, option?: IOption, filteredData?: ILegislation[]) {
    const dataToFilterFrom = filteredData ? [...filteredData] : this.legislationData;
    const key = option ? (option.code as keyof ILegislation) : this.selectedOption.code as keyof ILegislation;
    const isGlobal = !option?.code;
    this.filteredLegislationData = dataToFilterFrom.filter(legislation => {
      return isGlobal ? this.appStateService.globalSearchItem(legislation, currentSearchByKeyVal)
        : legislation[key]?.toLowerCase()?.includes(currentSearchByKeyVal.toLowerCase().trim());
    });
    this.childFilteredData = option ? this.childFilteredData : this.filteredLegislationData;
    this.setPaginateData();
  }

  reset() {
    this.filteredLegislationData = [...this.legislationData];
    this.setPaginateData();
  }

  paginate(event: any) {
    this.currentPage = event.page;
    this.setPaginateData();
  }

  resetChild() {
    this.filteredLegislationData = this.childFilteredData;
    this.setPaginateData();
  }

  searchBySelected(option: IOption) {
    this.childSelectedOption = option;
  }

  itemSelectedInDropdown(data: IDropdownClick) {
    this.filterLegislation(data.dropdownStr, this.childSelectedOption, this.childFilteredData);
  }

  itemSearched(searchVal: string) {
    this.filterLegislation(searchVal, this.childSelectedOption, this.childFilteredData);
    this.setPaginateData();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
