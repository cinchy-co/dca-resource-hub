import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IDropdownClick, ILegislation, IOption, ITag} from "../../models/common.model";
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
  @Input() tags: ITag[];
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
    this.legislationData = this.legislationData.map((item: any) => ({...item, tags: item['Tags'] ? item['Tags'].split(',') : []}));
    this.filteredLegislationData = [...this.legislationData];
    this.childFilteredData = [...this.legislationData];
    this.setPaginateData();
    this.setKeys();
    this.subscribeToStateChanges();
  }

  subscribeToStateChanges() {
    this.appStateService.getSearchEnteredVal().pipe(takeUntil(this.destroyed$)).subscribe(searchVal => {
      this.updateValues(searchVal);
    });

    this.appStateService.getDropdownOption().pipe(takeUntil(this.destroyed$)).subscribe(({dropdownStr, countrySelected}) => {
        this.updateValues(dropdownStr);
      });

    this.appStateService.getReset().pipe(takeUntil(this.destroyed$)).subscribe(isReset => {
      this.reset();
    });
  }

  updateValues(searchStr: string) {
   // this.tags = [...this.tags]; // so that it resets in child search
    this.filterLegislation(searchStr);
  }

  setPaginateData() {
    const startPoint = this.currentPage * this.pageSize;
    const endPoint = startPoint + this.pageSize;
    this.paginatedLegislationData = [...this.filteredLegislationData].slice(startPoint, endPoint);
  }

  setKeys() {
    this.allKeys = (Object.keys(this.legislationData[0]) as (keyof ILegislation)[]).filter(
      keyItem => keyItem !== 'Summary' && keyItem !== 'Law' && keyItem !== 'Law Url'
        && keyItem !== 'Combine Country' && keyItem !== 'Edit' && keyItem !== 'Tags' && keyItem !== 'tags'
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
