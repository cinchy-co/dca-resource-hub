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

    constructor(private appStateService: AppStateService) {
    }

    ngOnInit(): void {
        this.newsFeed = this.newsFeed.map((item: any) => {
            return {...item, tags: item['Tags'] ? item['Tags'].split(',') : []}
        })
        this.filteredNewsData = [...this.newsFeed];
        this.childFilteredData = [...this.newsFeed];
        this.setPaginateData();
        this.subscribeToStateChanges();
    }

    subscribeToStateChanges() {
        this.appStateService.getDropdownOption().pipe(takeUntil(this.destroyed$))
            .subscribe(({dropdownStr, countrySelected}) => {
                if (countrySelected) {
                    this.selectedType = '';
                    this.tags = [...this.tags]; // so that it resets in child search
                    this.filterNews(dropdownStr);
                }
            });

        this.appStateService.getReset().pipe(takeUntil(this.destroyed$)).subscribe(isReset => {
            this.reset();
        });
    }

    filterNews(currentSearchByKeyVal: string, keyOverride?: string, childFilteredData?: any, option?: IOption) {
        const dataToFilterFrom = childFilteredData ? childFilteredData : this.newsFeed;
        let key = keyOverride ? keyOverride : this.selectedOption.code;
        key = option ? option.code : key;
        this.filteredNewsData = dataToFilterFrom.filter((newsItem: any) => {
            return newsItem[key]?.toLowerCase()?.includes(currentSearchByKeyVal.toLowerCase().trim());
        });
        this.childFilteredData = keyOverride || option || (!this.filteredNewsData?.length && option) ? this.childFilteredData : this.filteredNewsData;
        this.setPaginateData();
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
        this.filterNews(data.dropdownStr, '', this.childFilteredData, this.searchByForTag);
    }

    resetChild() {
        this.filteredNewsData = this.childFilteredData;
        this.setPaginateData();
    }

    itemSearched(searchVal: string) {
        this.filterNews(searchVal, '', this.childFilteredData, this.searchByForTag);
        this.setPaginateData();
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }


}
