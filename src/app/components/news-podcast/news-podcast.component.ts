import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import {ReplaySubject, take, takeUntil} from "rxjs";
import {isPlatformBrowser} from "@angular/common";
import {IDropdownClick, ILegislation, IOption, ITag, IWebsiteDetails} from "../../models/common.model";
import {ApiCallsService} from "../../services/api-calls.service";
import {AppStateService} from "../../services/app-state.service";
import {SearchBy, SEPARATE_PAGE_SIZE} from "../../models/general-values.model";
import {WindowRefService} from "../../services/window-ref.service";
import {ITools} from "../hub/model/hub.model";
import {MenuItem} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";

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
  top20Tags: ITag[];
  selectedTags: ITag[] = [];
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
  currentMenuItem: MenuItem;
  currentTab: string = 'tool';
  toolId = 'tool-privacy-newsfeed';
  displayShare: boolean;
  currentNewsUrl: string;
  shareItem: any;
  currentItem: any;
  shareDesc = `This privacy news story from the free #Privacy Newsfeed app caught my eye 👀`;
  isSignedIn: boolean;
  signInMessage = `Please sign in to leave your feedback.`;

  constructor(private appStateService: AppStateService, @Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService, private apiCallsService: ApiCallsService,
              private changeDetectorRef: ChangeDetectorRef, private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  async ngOnInit() {
    this.isSignedIn = this.apiCallsService.isSignedIn();
    this.currentItem = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.apiCallsService.getToolDetails(this.toolId).pipe(take(1)).subscribe(tool => {
      this.toolDetails = tool[0];
    });
    this.getLegislationData();
    this.getNewsAndPodcasts();
    this.getBannerDetailsPerRoute();
    this.setTabItems();
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
      this.currentTab = params['tab'] ? params['tab'].toLowerCase() : 'tool';
      this.currentMenuItem = this.items.find(item => item.id === this.currentTab) || this.items[0];
    });
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
      },
      {
        label: 'Feedback', id: 'feedback', icon: 'pi pi-comment',
        command: () => {
          this.tabClicked('feedback');
        }
      }
    ];
  }

  tabClicked(tabId: string) {
    this.currentTab = tabId;
  }

  async getLegislationData() {
    this.legislationData = await this.apiCallsService.getLegislation().toPromise();
    this.changeDetectorRef.detectChanges();
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
      this.top20Tags = this.tags.filter(tag => tag.TopTags === 'Yes')
      this.newsAndPodcastsData = await this.apiCallsService.getNewsFeedAndPodcasts().toPromise();
      this.newsFeed = this.newsAndPodcastsData.map((item: any) => ({...item, tags: item['Tags'] ? item['Tags'].split(',') : []}));
      this.filteredNewsData = [...this.newsFeed];
      this.filteredNewsData = this.currentItem ?
        [this.newsFeed.find((item: any) => item['Id'] === this.currentItem)] : [...this.newsFeed];
      this.childFilteredData = [...this.newsFeed];
      this.setPaginateData();
      this.showError = false;
    } catch (e) {
      this.showError = true;
    }
    this.changeDetectorRef.detectChanges();
  }

  filterNews(currentSearchByKeyVal: string, keyOverride?: string, childFilteredData?: any, option?: IOption, tagsValue?:ITag[]) {
    const dataToFilterFrom = this.newsFeed;
    let key = keyOverride ? keyOverride : this.selectedOption.code;
    key = option ? option.code : key;
    const isGlobal = (!keyOverride && !option?.code) || option?.code === 'Tags';
    this.filteredNewsData = dataToFilterFrom.filter((newsItem: any) => {
      return this.filterCriteria(key, newsItem, currentSearchByKeyVal, isGlobal);
    });
    this.childFilteredData = keyOverride || option || (!this.filteredNewsData?.length && option) ? this.childFilteredData : this.filteredNewsData;
    this.setPaginateData();
    this.changeDetectorRef.detectChanges();
  }

  filterCriteria(key: string, newsItem: any, currentSearchByKeyVal: string, isGlobalSearch: boolean) {
    // BELOW IS TO FILTER OTHER ITEMS ALSO,
    // EXAMPLE If user selects Tags search, and if existing country is selected then that also has to be filtered.
    const ifCountryOrTag = (this.countrySearchVal && key !== 'Country') ||  (this.selectedTags && key !== 'Tags')
      ? this.appStateService.globalSearchItem(newsItem, this.countrySearchVal, this.countrySearchVal, this.selectedTags) : true;
    const ifType = this.selectedType && key !== 'Type' ? newsItem['Type']?.toLowerCase()?.includes(this.selectedType.toLowerCase().trim()) : true;
    return (key === 'Country' || key === 'Tags' ? this.appStateService.globalSearchItem(newsItem, currentSearchByKeyVal, this.countrySearchVal, this.selectedTags)
        : newsItem[key]?.toLowerCase()?.includes(currentSearchByKeyVal.toLowerCase().trim())
      ) && ifType && ifCountryOrTag;
  }

  radioOptionClicked() {
    if (!this.selectedType) {
      this.filterNews('', '', this.childFilteredData, this.searchByForTag);
      return;
    }
    this.filterNews(this.selectedType, 'Type', this.childFilteredData);
  }

  topTagSelected(tag: ITag) {
    const isAlreadyPresent = this.selectedTags.find(stag => stag.Tags === tag.Tags);
    if (isAlreadyPresent) {
      this.selectedTags = this.selectedTags.filter(stag => stag.Tags !== tag.Tags);
    } else {
      this.selectedTags.push(tag);
    }
    this.tagSelectedInDropdown(this.selectedTags);
  }

  isSelectedFilter(tag: ITag, labelKey?: string): boolean {
    return !!this.selectedTags.find(item => item.Tags?.toLowerCase().trim() === tag.Tags?.toLowerCase().trim() );
  }

  setPaginateData() {
    const startPoint = this.currentPage * this.pageSize;
    const endPoint = startPoint + this.pageSize;
    this.paginatedNewsData = [...this.filteredNewsData].slice(startPoint, endPoint);
  }

  reset() {
    this.countrySearchVal = '';
    this.selectedTags = [];
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

  tagSelectedInDropdown(tags: ITag[]) {
    this.filterNews('', '', this.childFilteredData, this.searchByForTag, tags);
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

  share(item: ILegislation) {
    this.shareItem = item;
    if (isPlatformBrowser(this.platformId)) {
      const url = this.windowRef.nativeWindow.location.href;
      this.currentNewsUrl = this.currentItem ? url : `${url}/${item.Id}`;
    }
    this.displayShare = true;
  }

  showAll() {
    this.router.navigate([`apps/privacy-newsfeed`]);
  }

  joinFree() {
    const url = this.websiteDetails['heroVideo']; // Need to change
    if(isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

  tagClicked(tag: string) {
    this.topTagSelected({Tags: tag.trim()});
    this.searchVal = tag;
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }


}

