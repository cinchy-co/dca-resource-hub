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
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private appStateService: AppStateService) { }

  ngOnInit(): void {
    this.filteredNewsData = [...this.newsFeed];
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

  filterNews(currentSearchByKeyVal: string) {
    this.filteredNewsData = this.newsFeed.filter((regulator: any) => {
      const key = this.selectedOption.code;
      return regulator[key]?.toLowerCase()?.indexOf(currentSearchByKeyVal.toLowerCase()) == 0;
    });
    this.setNewsPaginateData();
  }

  setNewsPaginateData() {
    const startPoint = this.currentPage * this.pageSize;
    const endPoint = startPoint + this.pageSize;
    this.paginatedNewsData = [...this.filteredNewsData].slice(startPoint, endPoint);
  }

  reset() {
    this.filteredNewsData = [...this.newsFeed];
    this.setNewsPaginateData();
  }

  paginate(event: any) {
    this.currentPage = event.page;
    this.setNewsPaginateData();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }


}
