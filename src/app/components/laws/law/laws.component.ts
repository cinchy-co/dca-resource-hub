import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {IDropdownClick, ILegislation, IOption, ITag} from "../../../models/common.model";
import {AppStateService} from "../../../services/app-state.service";
import {ReplaySubject, takeUntil} from "rxjs";
import {PAGE_SIZE, SearchByLaw} from "../../../models/general-values.model";
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "../../../services/window-ref.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-laws',
  templateUrl: './laws.component.html',
  styleUrls: ['./laws.component.scss']
})
export class LawsComponent implements OnInit, OnDestroy {
  @Input() legislationData: ILegislation[];
  @Input() selectedOption: IOption;
  @Input() isCountrySelected: boolean;
  @Input() countrySearchVal: string;
  @Input() tags: ITag[];
  @Input() bannerDetails: any;
  @Input() currentLaw: any;
  @Output() resetTags: EventEmitter<any> = new EventEmitter<any>();

  childSelectedOption: IOption;
  filteredLegislationData: ILegislation[];
  paginatedLegislationData: ILegislation[];
  currentPage = 0;
  pageSize = PAGE_SIZE - 2;
  allKeys: (keyof ILegislation)[];
  searchByOptions: IOption[] = SearchByLaw;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  childFilteredData: ILegislation[];
  selectedType = '';
  searchVal: string;
  countryValue: string;
  tagsValue: ITag[];
  displayShare: boolean;
  currentLawUrl: string;
  shareItem: ILegislation;
  shareDesc = `Sharing this privacy law summary info from the free #Privacy Law Navigator app:`;

  constructor(private appStateService: AppStateService, @Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService, private router: Router) {
  }

  ngOnInit(): void {
    this.legislationData = this.legislationData.map((item: any) => ({
      ...item,
      tags: item['Tags'] ? item['Tags'].split(',') : []
    }));
    this.filteredLegislationData = this.currentLaw ?
      [this.legislationData.find((item: ILegislation) => item['Id'] === this.currentLaw)] as ILegislation[]
      : [...this.legislationData];
    this.childFilteredData = [...this.legislationData];
    this.setPaginateData();
    this.setKeys();
    this.subscribeToStateChanges();
  }

  subscribeToStateChanges() {
    this.appStateService.getSearchEnteredVal().pipe(takeUntil(this.destroyed$)).subscribe(searchVal => {
      this.countryValue = searchVal;
      this.updateValues(searchVal);
    });

    this.appStateService.getDropdownOption().pipe(takeUntil(this.destroyed$))
      .subscribe(({dropdownStr, countrySelected}) => {
        this.countryValue = dropdownStr;
        this.updateValues(dropdownStr);
      });

    this.appStateService.getReset().pipe(takeUntil(this.destroyed$)).subscribe(isReset => {
      this.reset();
    });

    this.appStateService.getTopTags().pipe(takeUntil(this.destroyed$)).subscribe(tags => {
      this.tagsValue = tags;
      this.filterLegislation('', {name: 'Subject Area', code: 'Tags'}, this.childFilteredData);
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
        && keyItem !== 'Full Citation' && keyItem !== 'Enforcers-Id' && keyItem !== 'Bookmark'
        && keyItem !== 'Share' && keyItem !== 'Id'
    );
  }

  filterLegislation(currentSearchByKeyVal: string, option?: IOption, filteredData?: ILegislation[]) {
    const dataToFilterFrom = filteredData ? [...filteredData] : this.legislationData;
    const key = option ? (option.code as keyof ILegislation) : this.selectedOption.code as keyof ILegislation;
    const isGlobal = !option?.code || option.code === 'Tags';
    this.filteredLegislationData = dataToFilterFrom.filter(legislation => {
      return isGlobal ? this.appStateService.globalSearchItem(legislation, currentSearchByKeyVal, this.countryValue, this.tagsValue)
        : this.filterCriteria(key, legislation, currentSearchByKeyVal, isGlobal)
    });
    this.childFilteredData = option ? this.childFilteredData : this.filteredLegislationData;
    this.setPaginateData();
  }

  filterCriteria(key: string, lawItem: any, currentSearchByKeyVal: string, isGlobalSearch: boolean) {
    // BELOW IS TO FILTER OTHER ITEMS ALSO,
    // EXAMPLE If user selects Tags search, and if existing country is selected then that also has to be filtered.
    const ifCountry = this.countrySearchVal && key !== 'Country' ? this.appStateService.globalSearchItem(lawItem, this.countrySearchVal) : true;

    const ifChildFilterSearch = this.childSelectedOption && key !== this.childSelectedOption.code && this.searchVal
      ? lawItem[this.childSelectedOption.code]?.toLowerCase()?.includes(this.searchVal.toLowerCase().trim()) : true;

    const ifPending = this.selectedType && key !== 'Pending' ? this.selectedType === 'Pending' ? lawItem.Pending
        : this.selectedType === 'Active' ? !lawItem.Pending : true : true;

    return (key === 'Country' || key === 'Tags' ? this.appStateService.globalSearchItem(lawItem, currentSearchByKeyVal, this.countryValue, this.tagsValue)
          : key === 'Pending' ?
            currentSearchByKeyVal === 'Pending' ? lawItem.Pending
              : currentSearchByKeyVal === 'Active' ? !lawItem.Pending
                : true : lawItem[key]?.toLowerCase()?.includes(currentSearchByKeyVal.toLowerCase().trim())
      )
      && ifChildFilterSearch && ifPending && ifCountry;
  }

  radioOptionClicked() {
    this.currentPage = 0;
    this.filterLegislation(this.selectedType, {code: 'Pending', name: 'Pending'}, this.childFilteredData);
  }

  reset() {
    this.countryValue = '';
    this.resetTags.emit()
    this.filteredLegislationData = [...this.legislationData];
    this.childFilteredData = [...this.legislationData];
    this.setPaginateData();
  }

  paginate(event: any) {
    this.currentPage = event.page;
    this.setPaginateData();
  }

  resetChild() {
    this.filteredLegislationData = this.selectedType ? this.filteredLegislationData : this.childFilteredData;
    this.setPaginateData();
  }

  searchBySelected(option: IOption) {
    this.childSelectedOption = option;
  }

  itemSelectedInDropdown(data: IDropdownClick) {
    this.searchVal = data.dropdownStr;
    this.filterLegislation(data.dropdownStr, this.childSelectedOption, this.childFilteredData);
  }

  itemSearched(searchVal: string) {
    this.searchVal = searchVal;
    this.filterLegislation(searchVal, this.childSelectedOption, this.childFilteredData);
    this.setPaginateData();
  }

  isSelectedFilter(tag: string, labelKey?: string): boolean {
    return !!this.tagsValue?.find(item => item.Tags?.toLowerCase().trim() === tag.toLowerCase().trim());
  }

  share(item: ILegislation) {
    this.shareItem = item;
    if (isPlatformBrowser(this.platformId)) {
      const url = this.windowRef.nativeWindow.location.href;
      this.currentLawUrl = this.currentLaw ? url : `${url}/${item.Id}`;
    }
    this.displayShare = true;
  }

  joinFree() {
    const url = this.bannerDetails[0]['LawsContributeLink'];
    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

  goToRegulator(id: string) {
    this.router.navigate([`tools/privacy-regulators/${id}`]);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
