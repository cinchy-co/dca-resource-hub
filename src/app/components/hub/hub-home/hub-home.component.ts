import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ApiCallsService} from "../../../services/api-calls.service";
import {INewsFeed} from "../model/hub.model";
import {AppStateService} from "../../../services/app-state.service";
import {IFooter, ISocialMedia, IUser} from "../../../models/common.model";
import {ICommunityDetails} from "../../../models/general-values.model";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

@Component({
  selector: 'app-hub-home',
  templateUrl: './hub-home.component.html',
  styleUrls: ['./hub-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubHomeComponent implements OnInit {
  newsFeed: INewsFeed[];
  filteredNewsFeed: INewsFeed[];
  userDetails: IUser;
  footerDetails: IFooter[];
  socialMediaDetails: ISocialMedia[];
  headerDetails: ICommunityDetails;
  filters: { filterTag: string; filterGroup: string }[];
  groupNames: string[];
  selectedFilters: string[] = [];
  mappedFilters: any;

  constructor(private appApiService: ApiCallsService, private appStateService: AppStateService,
              private changeDetectionRef: ChangeDetectorRef) {
  }

  async ngOnInit() {
    const communityDetails = this.appStateService.communityDetails;
    this.headerDetails = communityDetails.find(item => item.id === 'home') as ICommunityDetails;
    this.userDetails = this.appStateService.userDetails;
    this.socialMediaDetails = (await this.appApiService.getSocialMediaDetails().toPromise());
    this.footerDetails = this.appStateService.footerDetails;
    this.newsFeed = (await this.appApiService.getHubNewsfeed().toPromise()) as INewsFeed[];
    this.filteredNewsFeed = this.newsFeed;
    this.filters = await this.appApiService.getHubNewsFilter().toPromise();
    this.setFiltersAsPerGroup();
    this.changeDetectionRef.detectChanges();
    console.log('111 filters', this.filters);
  }

  setFiltersAsPerGroup() {
    const mappedFilters: any = {};
    this.filters.forEach(item => {
      const currentGroup = mappedFilters[item.filterGroup];
      if (currentGroup) {
        currentGroup.push(item.filterTag);
      } else {
        mappedFilters[item.filterGroup] = [item.filterTag];
      }
    });
    this.groupNames = Object.keys(mappedFilters);
    this.mappedFilters = mappedFilters;
    console.log('1111 mappedFilters', mappedFilters);
  }

  getIcon(option: INewsFeed): IconProp {
    const iconToTake = option.type;
    return iconToTake.split(',') as IconProp;
  }

  getTags(option: INewsFeed): string[] {
    return option.tags.split(', ');
  }

  filterToggled(filter: string) {
    if (this.selectedFilters?.includes(filter)) {
      this.selectedFilters = this.selectedFilters.filter(item => item !== filter);
    } else {
      this.selectedFilters.push(filter);
    }
    this.filteredNewsFeed = this.newsFeed.filter(item => {
      const itemTags = this.getTags(item);
      return this.selectedFilters.length ? itemTags.some(r=> this.selectedFilters.includes(r)) : true;
    })
    this.changeDetectionRef.detectChanges();
  }

  clearFilters() {
    this.selectedFilters = [];
    this.filteredNewsFeed = this.newsFeed;
  }

  isSelectedFilter(filter: string): boolean {
    return this.selectedFilters?.includes(filter);
  }


}
