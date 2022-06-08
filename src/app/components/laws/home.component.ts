import {Component, Input, OnInit} from '@angular/core';
import {IAvatar, IDropdownClick, ILegislation, IOption, ITag, IWebsiteDetails} from "../../models/common.model";
import {ApiCallsService} from "../../services/api-calls.service";
import {AppStateService} from "../../services/app-state.service";
import {SearchBy} from "../../models/general-values.model";
import {ITools, IToolSection} from "../hub/model/hub.model";
import {MenuItem} from "primeng/api";
import {combineLatest, Observable, of, take} from "rxjs";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Input() avatars: IAvatar[];
  legislationData: ILegislation[];
  allRegulatorKeys: any[];
  searchByOptions: IOption[] = SearchBy;
  regulatorData: any;
  newsAndPodcastsData: any;
  searchVal: any; //
  selectedOption: IOption; //
  dropdownOptionStr: string; //
  countrySelected: string | undefined;//
  tags: ITag[];
  showError: boolean
  bannerDetails: any;
  bannerDetailsPerRoute: IWebsiteDetails;
  items: MenuItem[];
  toolDetails: ITools;
  currentTab: string = 'tool';

  constructor(private apiCallsService: ApiCallsService, private appStateService: AppStateService) {
  }

  async ngOnInit() {
    this.reset();
    this.setTabItems();
    this.apiCallsService.getToolDetails('tool-privacy-law-navigator').pipe(take(1))
      .subscribe(tool => {
        this.toolDetails = tool[0];
      });

    this.getLegislationData();
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
    if (tabId === 'overview') {
      this.reset();
    }
    this.currentTab = tabId;
  }

  async getLegislationData() {
    this.legislationData = await this.apiCallsService.getLegislation().toPromise();
  }

  async getTags() {
    this.tags = await this.apiCallsService.getTags().toPromise();
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

  reset() {
    this.searchVal = '';
    this.appStateService.setReset(true);
  }

}
