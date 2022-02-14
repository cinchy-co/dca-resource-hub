import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IOption} from "../../models/common.model";
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
  @Input() selectedOption: IOption;
  currentPage = 0;
  pageSize = PAGE_SIZE;
  paginatedNewsData: any;
  filteredNewsData: any;
  selectedType = '';
  childFilteredData: any;
  sortOrder = 'Descending';
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private appStateService: AppStateService) { }

  ngOnInit(): void {
    this.filteredNewsData = [...this.newsFeed];
    this.childFilteredData = [...this.newsFeed];
    this.setNewsPaginateData();
    this.subscribeToStateChanges();
  }

  subscribeToStateChanges() {
    this.appStateService.getDropdownOption().pipe(takeUntil(this.destroyed$))
      .subscribe(({dropdownStr, countrySelected}) => {
        if (countrySelected) {
          this.filterNews(dropdownStr);
        }
      });

    this.appStateService.getReset().pipe(takeUntil(this.destroyed$)).subscribe(isReset => {
      this.reset();
    });
  }

  filterNews(currentSearchByKeyVal: string, keyOverride?: string, childFilteredData?: any) {
    const dataToFilterFrom = childFilteredData ? childFilteredData : this.newsFeed;
    this.filteredNewsData = dataToFilterFrom.filter((regulator: any) => {
      const key = keyOverride ? keyOverride : this.selectedOption.code;
      return regulator[key]?.toLowerCase()?.indexOf(currentSearchByKeyVal.toLowerCase()) == 0;
    });
    this.childFilteredData = keyOverride ? this.childFilteredData : this.filteredNewsData;
    this.setNewsPaginateData();
  }

  radioOptionClicked() {
    if (!this.selectedType) {
      this.filteredNewsData = this.childFilteredData;
      this.setNewsPaginateData();
      return ;
    }
    this.filterNews(this.selectedType, 'Type', this.childFilteredData);
  }

  setNewsPaginateData() {
    const startPoint = this.currentPage * this.pageSize;
    const endPoint = startPoint + this.pageSize;
    this.paginatedNewsData = [...this.filteredNewsData].slice(startPoint, endPoint);
  }

  reset() {
    this.selectedType = '';
    this.childFilteredData = [...this.newsFeed];
    this.filteredNewsData = [...this.newsFeed];
    this.setNewsPaginateData();
  }

  paginate(event: any) {
    this.currentPage = event.page;
    this.setNewsPaginateData();
  }

  sortChanged() {
    this.sortOrder = this.sortOrder === 'Ascending' ? 'Descending' : 'Ascending';
    this.filteredNewsData.sort((a: any, b: any) => {
      return this.sortOrder === 'Ascending' ? new Date(a.Date).getTime() - new Date(b.Date).getTime() : new Date(b.Date).getTime() - new Date(a.Date).getTime();
    });
    this.setNewsPaginateData();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }


}
