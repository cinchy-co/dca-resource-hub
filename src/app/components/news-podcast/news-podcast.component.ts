import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import {ReplaySubject, takeUntil} from "rxjs";
import {isPlatformBrowser} from "@angular/common";
import {IDropdownClick, ILegislation, IOption, ITag, IWebsiteDetails} from "../../models/common.model";
import {ApiCallsService} from "../../services/api-calls.service";
import {AppStateService} from "../../services/app-state.service";
import {SearchBy, SEPARATE_PAGE_SIZE} from "../../models/general-values.model";
import {WindowRefService} from "../../services/window-ref.service";
import {ITools} from "../hub/model/hub.model";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-news-podcast',
  templateUrl: './news-podcast.component.html',
  styleUrls: ['./news-podcast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsPodcastComponent implements OnInit, OnDestroy {
  newsFeed: any;
  legislationData: ILegislation[];
  searchByCountry: IOption[] = SearchBy;
  dropdownOptionStr: string;
  countrySelected: string | undefined;//
  countrySearchVal: string;
  tags: ITag[];
  selectedOption: IOption = {code: 'Country', name: 'Country'};
  currentPage = 0;
  pageSize = SEPARATE_PAGE_SIZE;
  paginatedNewsData: any;
  filteredNewsData: any;
  selectedType = '';
  childFilteredData: any;
  sortOrder = 'Descending';
  searchByForTag: IOption = {name: 'Tags', code: 'Tags'};
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  searchVal: string;
  newsAndPodcastsData: any;
  showError = false;
  websiteDetails: IWebsiteDetails;
  toolDetails: ITools;
  items: MenuItem[];
  currentTab: string = 'overview';

  constructor(private appStateService: AppStateService, @Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService, private apiCallsService: ApiCallsService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  async ngOnInit() {
    this.apiCallsService.getToolDetails('privacy-newsfeed').subscribe(tool => {
      this.toolDetails = tool[0];
    });
    this.appStateService.tool['privacy-newsfeed'] = this.toolDetails;
    this.getLegislationData();
    this.getNewsAndPodcasts();
    this.getBannerDetailsPerRoute();
    this.setTabItems();
  }

  setTabItems() {
    this.items = [
      {
        label: 'Overview', id: 'overview', icon: 'pi pi-fw pi-home',
        command: () => {
          this.tabClicked('overview');
        }
      },
      {
        label: 'Tool', id: 'tool', icon: 'pi pi-fw pi-cog',
        command: () => {
          this.tabClicked('tool');
        }
      }
    ];
  }

  tabClicked(tabId: string) {
    this.currentTab = tabId;
  }

  async getLegislationData() {
    this.legislationData = await this.apiCallsService.getLegislation().toPromise();
  }

  itemSelectedInDropdown(data: IDropdownClick) {
    this.countrySearchVal = data.dropdownStr;
    this.dropdownOptionStr = data.dropdownStr;
    this.countrySelected = data.countrySelected;
    const {dropdownStr, countrySelected} = data;
    this.filterNews(dropdownStr);
  }

  countrySearched(val: string) {
    this.countrySearchVal = val;
    this.filterNews(val);
  }

  async getBannerDetailsPerRoute() {
    this.websiteDetails = (await this.apiCallsService.getWebsiteDetails('news-podcast').toPromise())[0];
  }

  async getNewsAndPodcasts() {
    try {
      this.tags = await this.apiCallsService.getTags().toPromise();
      this.newsAndPodcastsData = await this.apiCallsService.getNewsFeedAndPodcasts().toPromise();
      this.newsFeed = this.newsAndPodcastsData.map((item: any) => ({...item, tags: item['Tags'] ? item['Tags'].split(',') : []}));
      this.filteredNewsData = [...this.newsFeed];
      this.childFilteredData = [...this.newsFeed];
      this.setPaginateData();
      this.showError = false;
    } catch (e) {
      this.showError = true;
    }
    this.changeDetectorRef.detectChanges();
  }

  filterNews(currentSearchByKeyVal: string, keyOverride?: string, childFilteredData?: any, option?: IOption) {
    const dataToFilterFrom = this.newsFeed;
    let key = keyOverride ? keyOverride : this.selectedOption.code;
    key = option ? option.code : key;
    const isGlobalSearch = !keyOverride && !option?.code;
    this.filteredNewsData = dataToFilterFrom.filter((newsItem: any) => {
      return this.filterCriteria(key, newsItem, currentSearchByKeyVal, isGlobalSearch);
    });
    this.childFilteredData = keyOverride || option || (!this.filteredNewsData?.length && option) ? this.childFilteredData : this.filteredNewsData;
    this.setPaginateData();
    this.changeDetectorRef.detectChanges();
  }

  filterCriteria(key: string, newsItem: any, currentSearchByKeyVal: string, isGlobalSearch: boolean) {
    // BELOW IS TO FILTER OTHER ITEMS ALSO,
    // EXAMPLE If user selects Tags search, and if existing country is selected then that also has to be filtered.
    const ifCountry = this.countrySearchVal && key !== 'Country' ? this.appStateService.globalSearchItem(newsItem, this.countrySearchVal) : true;
    const ifTagStr = this.searchVal && key !== 'Tags' ? newsItem['Tags']?.toLowerCase()?.includes(this.searchVal.toLowerCase().trim()) : true;
    const ifType = this.selectedType && key !== 'Type' ? newsItem['Type']?.toLowerCase()?.includes(this.selectedType.toLowerCase().trim()) : true;
    return (key === 'Country' ? this.appStateService.globalSearchItem(newsItem, currentSearchByKeyVal)
        : newsItem[key]?.toLowerCase()?.includes(currentSearchByKeyVal.toLowerCase().trim())
      )
      && ifTagStr && ifType && ifCountry;
  }

  radioOptionClicked() {
    if (!this.selectedType) {
      this.filterNews('', '', this.childFilteredData, this.searchByForTag);
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
    this.countrySearchVal = '';
    this.filterNews('');
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

  tagSelectedInDropdown(data: IDropdownClick) {
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

  joinFree() {
    const url = this.websiteDetails['heroVideo']; // Need to change
    if(isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

  tagClicked(tag: any) {
    this.tagSelectedInDropdown({dropdownStr: tag});
    this.searchVal = tag;
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }


}

