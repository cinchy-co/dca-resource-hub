import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {IDropdownClick, IFooter, ILandingFooter, IOption, ITag, IUser} from "../models/common.model";
import {ICommunityDetails, MappedCombinedCountryKey} from "../models/general-values.model";
import {
  ICollab, IEvents,
  INewsSelectedFilter,
  IToolDetails,
  ITools,
  IToolsOverview,
  ToolIds
} from "../components/hub/model/hub.model";
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "./window-ref.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  search$: Subject<string> = new Subject<string>();
  reset$: Subject<boolean> = new Subject<boolean>();
  dropdownOptionClicked$: Subject<IDropdownClick> = new Subject<IDropdownClick>();
  topTagClicked$: Subject<ITag[]> = new Subject<ITag[]>();
  sidebarToggled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  hideSidebarToggled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentSidebarOption$: Subject<string> = new Subject<string>();
  userDetails$: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(({} as IUser));
  avatars: any;
  communityDetails: ICommunityDetails[];
  userDetails: IUser;
  footerDetails: IFooter[];
  currentToolSelected: ITools;
  tool: any = {};
  toolsOverview: any = {};
  newsFeedHomeFilters: INewsSelectedFilter[];
  showFeatures = true;
  currentCollab: ICollab;
  hubEvents: IEvents[];
  setRoutingOnLogin$ = new Subject();
  loggedIn: boolean;
  authorizationHeader: any;

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService, private router: Router) {
  }

  setRoutingAndGlobalDetails(val: any) {
    this.setRoutingOnLogin$.next(val);
  }

  getRoutingOnLogin() {
    return this.setRoutingOnLogin$.asObservable();
  }

  setCurrentUrl() {
    if (isPlatformBrowser(this.platformId)) {
      const url = this.windowRef.nativeWindow.location.href;
      sessionStorage.setItem('current-url-hub', url);
    }
  }

  setDefaultUrl() {
    if (isPlatformBrowser(this.platformId)) {
      const url = this.windowRef.nativeWindow.location.href;
      sessionStorage.setItem('current-url-hub', url);
    }
  }

  setSidebarToggled(val: boolean) {
    this.sidebarToggled$.next(val);
  }

  getSidebarToggled() {
    return this.sidebarToggled$.asObservable();
  }

  setDisplayOfSidebarToggled(val: boolean) {
    this.hideSidebarToggled$.next(val);
  }

  getDisplayOfSidebarToggled() {
    return this.hideSidebarToggled$.asObservable();
  }

  setSidebarOption(val: string) {
    this.currentSidebarOption$.next(val);
  }

  getSidebarOption() {
    return this.currentSidebarOption$.asObservable();
  }

  setUserDetailsSub(val: IUser) {
    this.userDetails$.next(val);
  }

  getUserDetailsSub() {
    return this.userDetails$.asObservable();
  }

  setSearch(val: string) {
    this.search$.next(val);
  }

  getSearchEnteredVal() {
    return this.search$.asObservable();
  }

  setReset(val: boolean) {
    this.reset$.next(val);
  }

  getReset() {
    return this.reset$.asObservable();
  }

  setDropdownOption(val: IDropdownClick) {
    this.dropdownOptionClicked$.next(val);
  }

  getDropdownOption() {
    return this.dropdownOptionClicked$.asObservable();
  }

  setTopTags(val: ITag[]) {
    this.topTagClicked$.next(val);
  }

  getTopTags() {
    return this.topTagClicked$.asObservable();
  }

  getGroupedItems(allItems: ILandingFooter[]) {
    const groupWise: any = {};
    allItems.forEach(item => {
      if (groupWise[item.footerGroup]) {
        groupWise[item.footerGroup].push(item);
      } else {
        groupWise[item.footerGroup] = [item];
      }
    });
    return groupWise;
  }

  getUniqueOptions(dataForOptions: any, selectedOption: IOption, addAnotherSet?: boolean) {
    const key = selectedOption.code;
    let anotherSetUniqueOptions: any[] = [];
    let uniqueOptions = [...new Set(dataForOptions.map((item: any) => {
      return item[key];
    }))];
    if (addAnotherSet) {
      const keyForAnotherSet = MappedCombinedCountryKey;
      anotherSetUniqueOptions = [...new Set(dataForOptions.map((item: any) => {
        return item[keyForAnotherSet];
      }))];
    }
    uniqueOptions = addAnotherSet ? [...uniqueOptions, ...anotherSetUniqueOptions] : uniqueOptions;
    return (uniqueOptions.filter(item => item)).map(optionItem => {
      const newDropdownList: any = {};
      newDropdownList[key] = optionItem;
      return newDropdownList;
    });
  }

  globalSearchItem(item: any, currentSearchByKeyVal: string, countryValue?: string, tags?: ITag[]) {
    if (countryValue && tags?.length) {
      const mappedTags = item.tags.map((tagV: string) => tagV.trim().toLowerCase());
      return (item['Country']?.toLowerCase()?.includes(countryValue?.toLowerCase().trim())
          || item['Combine Country']?.toLowerCase()?.includes(countryValue?.toLowerCase().trim())
          || item['Region']?.toLowerCase()?.includes(countryValue?.toLowerCase().trim())
          || currentSearchByKeyVal?.toLowerCase()?.includes(item['Region']?.toLowerCase().trim()))
        && tags.every(r => mappedTags.includes(r.Tags.toLowerCase()));
    } else if (countryValue && !tags?.length) {
      return item['Country']?.toLowerCase()?.includes(countryValue?.toLowerCase().trim())
        || item['Combine Country']?.toLowerCase()?.includes(countryValue?.toLowerCase().trim())
        || item['Region']?.toLowerCase()?.includes(countryValue?.toLowerCase().trim())
        || currentSearchByKeyVal?.toLowerCase().trim()?.includes(item['Region']?.toLowerCase().trim());
    } else if (tags?.length) {
      const mappedTags = item.tags.map((tagV: string) => tagV.trim().toLowerCase());
      return tags.every(r => mappedTags.includes(r.Tags.toLowerCase()));
    } else {
      return true;
    }
  }
}
