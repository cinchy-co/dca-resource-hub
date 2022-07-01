import {Component, Input, OnInit} from '@angular/core';
import {IAvatar, IDropdownClick, ILegislation, IOption, ITag, IWebsiteDetails} from "../../models/common.model";
import {ApiCallsService} from "../../services/api-calls.service";
import {AppStateService} from "../../services/app-state.service";
import {SearchBy} from "../../models/general-values.model";
import {ITools} from "../hub/model/hub.model";
import {MenuItem} from "primeng/api";
import {take} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-home',
  templateUrl: './reg-home.component.html',
  styleUrls: ['./reg-home.component.scss']
})
export class RegHomeComponent implements OnInit {
  @Input() avatars: IAvatar[];
  legislationData: ILegislation[];
  allRegulatorKeys: any[];
  searchByOptions: IOption[] = SearchBy;
  regulatorData: any;
  searchVal: any; //
  selectedOption: IOption; //
  dropdownOptionStr: string; //
  countrySelected: string | undefined;//
  tags: ITag[];
  showError: boolean
  bannerDetails: any;
  bannerDetailsPerRoute: IWebsiteDetails;
  toolDetails: ITools;
  items: MenuItem[];
  currentTab: string = 'tool';
  currentRegulator: string;
  toolId = 'tool-privacy-regulator-navigator';
  top20Tags: ITag[];
  selectedTags: ITag[] = [];


  constructor(private apiCallsService: ApiCallsService, private appStateService: AppStateService,
              private activatedRoute: ActivatedRoute, private router: Router) {
  }

  async ngOnInit() {
    this.currentRegulator = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.setTabItems();
    this.apiCallsService.getToolDetails(this.toolId).pipe(take(1)).subscribe(tool => {
      this.toolDetails = tool[0];
    });
    this.getLegislationData();
    this.getRegulatorData();
    this.getTags();
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
  }

  async getRegulatorData() {
    this.regulatorData = await this.apiCallsService.getPrivacyRegulators().toPromise();
  }

  async getTags() {
    this.tags = await this.apiCallsService.getTags().toPromise();
    this.top20Tags = this.tags.filter(tag => tag.TopTags === 'Yes')
  }

  async getWebsiteDetails() {
    this.bannerDetails = await this.apiCallsService.getHeaderBannerDetails().toPromise();
  }

  async getBannerDetailsPerRoute() {
    this.bannerDetailsPerRoute = (await this.apiCallsService.getWebsiteDetails('privacy').toPromise())[0];
  }

  searchBySelected(option: IOption) {
    this.selectedOption = option;
  }

  itemSelectedInDropdown(data: IDropdownClick) {
    this.searchVal = data.dropdownStr;
    this.dropdownOptionStr = data.dropdownStr;
    this.countrySelected = data.countrySelected;
    this.appStateService.setDropdownOption(data);
  }

  itemSearched(val: string) {
    this.searchVal = val;
    this.appStateService.setSearch(val);
  }

  topTagSelected(tag: ITag) {
    const isAlreadyPresent = this.selectedTags.find(stag => stag.Tags === tag.Tags);
    if (isAlreadyPresent) {
      this.selectedTags = this.selectedTags.filter(stag => stag.Tags !== tag.Tags);
    } else {
      this.selectedTags.push(tag);
    }
    this.appStateService.setTopTags(this.selectedTags);
  }

  isSelectedFilter(tag: ITag, labelKey?: string): boolean {
    return !!this.selectedTags.find(item => item.Tags === tag.Tags);
  }


  showAllRegulators() {
    this.router.navigate([`tools/privacy-regulators`]);
  }

  goToLaws() {
    this.router.navigate([`tools/privacy-law-navigator`]);
  }

  resetTags() {
    this.selectedTags = [];
  }

  reset() {
    this.searchVal = '';
    this.appStateService.setReset(true);
  }

}
