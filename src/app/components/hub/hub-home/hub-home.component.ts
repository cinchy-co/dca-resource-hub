import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ApiCallsService} from "../../../services/api-calls.service";
import {INewsFeed, INewsFeedFilter, INewsSelectedFilter, ISelectedFilter} from "../model/hub.model";
import {AppStateService} from "../../../services/app-state.service";
import {IFooter, ISocialMedia, IUser} from "../../../models/common.model";
import {ICommunityDetails} from "../../../models/general-values.model";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {ActivatedRoute, Router} from "@angular/router";
import {ReplaySubject, take, takeUntil} from "rxjs";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-hub-home',
  templateUrl: './hub-home.component.html',
  styleUrls: ['./hub-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubHomeComponent implements OnInit, OnDestroy {
  newsFeed: INewsFeed[];
  filteredNewsFeed: INewsFeed[];
  userDetails: IUser;
  footerDetails: IFooter[];
  socialMediaDetails: ISocialMedia[];
  headerDetails: ICommunityDetails;
  filters: INewsFeedFilter[];
  groupNames: string[];
  selectedFilters: INewsSelectedFilter[] = [];
  mappedFilters: any;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private appApiService: ApiCallsService, private appStateService: AppStateService,
              private changeDetectionRef: ChangeDetectorRef, private activatedRoute: ActivatedRoute,
              private router: Router, private messageService: MessageService) {
  }

  async ngOnInit() {
    const communityDetails = this.appStateService.communityDetails;
    this.newsFeed = (await this.appApiService.getHubNewsfeed().toPromise()) as INewsFeed[];
    this.filters = await this.appApiService.getHubNewsFilter().toPromise();
    this.setFiltersAsPerGroup();
    this.userDetails = this.appStateService.userDetails;
    if (this.appStateService.newsFeedHomeFilters?.length) {
      this.selectedFilters = this.appStateService.newsFeedHomeFilters;
      this.filterNewsFeed();
    } else {
      this.appStateService.getUserDetailsSub().subscribe(userDetails => {
        this.userDetails = userDetails;
        this.appApiService.getSavedHubNewsFilter(this.userDetails.displayName).pipe(take(1)).subscribe(savedFilters => {
          if (savedFilters?.length && savedFilters[0].id) {
            const filterNames = savedFilters[0].filter.split(', ');
            const filterIds = savedFilters[0].id.split(', ');
            this.selectedFilters = filterNames.map((name: string, i: string) => ({
              filter: {
                name: name, id: filterIds[i]
              }
            }));
            this.appStateService.newsFeedHomeFilters = this.selectedFilters;
            this.filterNewsFeed();
          } else {
            this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
              this.updateFilters(params);
            });
          }
        });
      })
    }

    this.headerDetails = communityDetails.find(item => item.id === 'home') as ICommunityDetails;
    this.socialMediaDetails = (await this.appApiService.getSocialMediaDetails().toPromise());
    this.footerDetails = this.appStateService.footerDetails;
    this.changeDetectionRef.detectChanges();
  }

  updateFilters(params: any) {
    const paramKeys = Object.keys(params);
    const quickFiltersArr: any = [];
    paramKeys.forEach((key: string) => {
      const keyValues = params[key].split(',');
      keyValues.forEach((item: string) => {
        const filterInMapped = this.mappedFilters[key];
        if (filterInMapped) {
          const valueOfFilter = filterInMapped.filters.find((filterVal: ISelectedFilter) => item.toLocaleLowerCase() === filterVal.name.toLocaleLowerCase());
          valueOfFilter && quickFiltersArr.push({labelKey: key, filter: valueOfFilter});
        }
      })
    });
    this.selectedFilters = quickFiltersArr;
    this.appStateService.newsFeedHomeFilters = this.selectedFilters;
    this.filterNewsFeed();
  }

  setFiltersAsPerGroup() {
    const mappedFilters: any = {};
    this.filters.forEach(item => {
      const currentGroup = mappedFilters[item.filterGroup];
      if (currentGroup) {
        currentGroup.filters.push({name: item.filterTag, id: item.id});
      } else {
        mappedFilters[item.filterGroup] = {filters: [{name: item.filterTag, id: item.id}], labelKey: item.labelKey};
      }
    });
    this.groupNames = Object.keys(mappedFilters);
    this.mappedFilters = mappedFilters;
  }

  getIcon(option: INewsFeed): IconProp {
    const iconToTake = option.type;
    return iconToTake.split(',') as IconProp;
  }

  getTags(option: INewsFeed): string[] {
    return option.tags.split(', ');
  }

  filterToggled(filter: ISelectedFilter, labelKey: string) {
    const isInSelectedFilters = this.selectedFilters.find(item => item.filter.name === filter.name);
    if (isInSelectedFilters) {
      this.selectedFilters = this.selectedFilters.filter(item => item.filter !== filter);
    } else {
      this.selectedFilters.push({filter, labelKey});
    }
    this.appStateService.newsFeedHomeFilters = this.selectedFilters;
    this.filterNewsFeed();
    this.changeDetectionRef.detectChanges();
  }

  filterNewsFeed() {
    this.filteredNewsFeed = this.newsFeed.filter((item: any) => {
      const itemTags = this.getTags(item);
      return this.selectedFilters.length ?
        itemTags.some(r => this.selectedFilters.find(fItem => fItem.filter.name.toLocaleLowerCase() === r.toLocaleLowerCase()))
        || this.selectedFilters.find(fItem => fItem.filter.name.toLocaleLowerCase() === item.category.toLocaleLowerCase())
        : true;
    });
    this.changeDetectionRef.detectChanges();
  }

  clearFilters() {
    this.selectedFilters = [];
    this.filteredNewsFeed = this.newsFeed;
  }

  isSelectedFilter(filter: ISelectedFilter, labelKey?: string): boolean {
    return !!this.selectedFilters.find(item => item.filter.name === filter.name);
  }

  async saveFilters() {
    const allFilterIdParam = this.selectedFilters.map(filter => filter.filter.id).join();
    await this.appApiService.saveHubNewsFilter(allFilterIdParam).toPromise();
    this.messageService.add({severity:'success', summary:'Filters Saved', detail:'Your filter selection has been saved'});
  }

  clearQueryParam() {
    this.router.navigate([], {
      queryParams: {
        'tags': null,
        'category': null,
      },
      queryParamsHandling: 'merge'
    })
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
