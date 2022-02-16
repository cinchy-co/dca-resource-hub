import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IDropdownClick, ILegislation, IOption, ITag} from "../../models/common.model";
import {ReplaySubject, takeUntil} from "rxjs";
import {AppStateService} from "../../services/app-state.service";
import {PAGE_SIZE} from "../../models/general-values.model";

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss']
})
export class NewsFeedComponent implements OnInit, OnDestroy {
  @Input() newsFeed: any;
  @Input() tags: ITag[];
  @Input() selectedOption: IOption;
  currentPage = 0;
  pageSize = PAGE_SIZE;
  paginatedNewsData: any;
  filteredNewsData: any;
  selectedType = '';
  childFilteredData: any;
  sortOrder = 'Descending';
  searchByForTag: IOption = {name: 'Tags', code: 'Tags'};
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  searchVal: string;

  constructor(private appStateService: AppStateService) {
  }

  ngOnInit(): void {
    this.newsFeed = this.newsFeed.map((item: any) => ({...item, tags: item['Tags'] ? item['Tags'].split(',') : []}));
    this.filteredNewsData = [...this.newsFeed];
    this.childFilteredData = [...this.newsFeed];
    this.setPaginateData();
    this.subscribeToStateChanges();
  }

  subscribeToStateChanges() {
    this.appStateService.getDropdownOption().pipe(takeUntil(this.destroyed$)).subscribe(({dropdownStr, countrySelected}) => {
      this.updateValues(dropdownStr);
    });

    this.appStateService.getSearchEnteredVal().pipe(takeUntil(this.destroyed$)).subscribe(searchVal => {
      this.updateValues(searchVal);
    });

    this.appStateService.getReset().pipe(takeUntil(this.destroyed$)).subscribe(isReset => {
      this.reset();
    });
  }

  updateValues(searchStr: string) {
    this.selectedType = '';
    this.tags = [...this.tags]; // so that it resets in child search
    this.filterNews(searchStr);
  }

  filterNews(currentSearchByKeyVal: string, keyOverride?: string, childFilteredData?: any, option?: IOption) {
    const dataToFilterFrom = childFilteredData ? childFilteredData : this.newsFeed;
    let key = keyOverride ? keyOverride : this.selectedOption.code;
    key = option ? option.code : key;
    const isGlobalSearch = !keyOverride && !option?.code;
    this.filteredNewsData = dataToFilterFrom.filter((newsItem: any) => {
      return this.filterCriteria(key, newsItem, currentSearchByKeyVal, isGlobalSearch);
    });
    this.childFilteredData = keyOverride || option || (!this.filteredNewsData?.length && option) ? this.childFilteredData : this.filteredNewsData;
    this.setPaginateData();
  }

  filterCriteria(key: string, newsItem: any, currentSearchByKeyVal: string, isGlobalSearch: boolean) {
    if (isGlobalSearch) {
      return this.appStateService.globalSearchItem(newsItem, currentSearchByKeyVal);
    }
    const ifSearchStr = this.searchVal && key !== 'Tags' ? newsItem['Tags']?.toLowerCase()?.includes(this.searchVal.toLowerCase().trim()) : true;
    const ifType = this.selectedType && key !== 'Type' ? newsItem['Type']?.toLowerCase()?.includes(this.selectedType.toLowerCase().trim()) : true;
    return newsItem[key]?.toLowerCase()?.includes(currentSearchByKeyVal.toLowerCase().trim()) && ifSearchStr && ifType;
  }

  radioOptionClicked() {
    if (!this.selectedType) {
      this.filteredNewsData = this.childFilteredData;
      this.setPaginateData();
      return;
    }
    this.filterNews(this.selectedType, 'Type', this.childFilteredData);
  }

  setPaginateData() {
    const startPoint = this.currentPage * this.pageSize;
    const endPoint = startPoint + this.pageSize;
    this.paginatedNewsData = [...this.filteredNewsData].slice(startPoint, endPoint);
  }

  reset() {
    this.selectedType = '';
    this.childFilteredData = [...this.newsFeed];
    this.filteredNewsData = [...this.newsFeed];
    this.tags = [...this.tags];
    this.setPaginateData();
  }

  paginate(event: any) {
    this.currentPage = event.page;
    this.setPaginateData();
  }

  sortChanged() {
    this.sortOrder = this.sortOrder === 'Ascending' ? 'Descending' : 'Ascending';
    this.filteredNewsData.sort((a: any, b: any) => {
      return this.sortOrder === 'Ascending' ? new Date(a.Date).getTime() - new Date(b.Date).getTime() : new Date(b.Date).getTime() - new Date(a.Date).getTime();
    });
    this.setPaginateData();
  }

  itemSelectedInDropdown(data: IDropdownClick) {
    this.searchVal = data.dropdownStr;
    this.filterNews(data.dropdownStr, '', this.childFilteredData, this.searchByForTag);
  }

  resetChild() {
    this.searchVal = '';
    this.radioOptionClicked();
  }

  itemSearched(searchVal: string) {
    this.searchVal = searchVal;
    this.filterNews(searchVal, '', this.childFilteredData, this.searchByForTag);
    this.setPaginateData();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }


}
