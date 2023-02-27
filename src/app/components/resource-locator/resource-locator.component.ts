import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {MenuItem} from "primeng/api";
import {take} from "rxjs";
import {ApiCallsService} from "../../services/api-calls.service";
import {AppStateService} from "../../services/app-state.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ITools, ToolSearchAction} from "../hub/model/hub.model";
import {IDropdownClick, IOption, ISponsor, ITag} from "../../models/common.model";
import {PAGE_SIZE, SearchByTag} from "../../models/general-values.model";
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "../../services/window-ref.service";

@Component({
  selector: 'app-resource-locator',
  templateUrl: './resource-locator.component.html',
  styleUrls: ['./resource-locator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceLocatorComponent implements OnInit {
  items: MenuItem[];
  currentTab: string = 'tool';
  toolId: string = 'tool-privacy-resource-locator';
  toolDetails: ITools;
  top20Tags: ITag[];
  selectedTags: ITag[] = [];
  tags: ITag[];
  searchByOptions = SearchByTag;
  searchVal: string;
  selectedOption: IOption; //
  toolList: ToolSearchAction[];
  paginatedData: ToolSearchAction[];
  pageSize = PAGE_SIZE;
  currentPage = 0;
  totalButtonsArray: any[] = [];
  isSignedIn: boolean;
  signInMessage = `Please sign in to leave your feedback.`;
  sponsors: ISponsor[];

  constructor(private apiCallsService: ApiCallsService, private appStateService: AppStateService,
              private activatedRoute: ActivatedRoute, private router: Router,
              private changeDetectorRef: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService) { }

  ngOnInit(): void {
    this.isSignedIn = this.apiCallsService.isSignedIn();
    this.setTabItems();
    this.getTags();
    this.apiCallsService.getToolDetails(this.toolId).pipe(take(1)).subscribe(tool => {
      this.toolDetails = tool[0];
      this.changeDetectorRef.detectChanges();
    });

    this.apiCallsService.getToolSponsors(this.toolId).pipe(take(1)).subscribe(sponsors => {
      this.sponsors = sponsors;
    });
  }

  async getTags() {
    this.tags = await this.apiCallsService.getTags().toPromise();
    this.top20Tags = this.tags.filter(tag => tag.TopTags === 'Yes');
    this.changeDetectorRef.detectChanges();
  }

  topTagSelected(tag: ITag) {
    const isAlreadyPresent = this.selectedTags.find(stag => stag.Tags === tag.Tags);
    if (isAlreadyPresent) {
      this.selectedTags = this.selectedTags.filter(stag => stag.Tags !== tag.Tags);
      this.reset();
    } else {
      this.selectedTags = [];
      this.searchVal = tag.Tags;
      this.selectedTags.push(tag);
      this.getToolOptions();
    }
  }

  isSelectedFilter(tag: ITag, labelKey?: string): boolean {
    return !!this.selectedTags.find(item => item.Tags === tag.Tags);
  }

  searchBySelected(option: IOption) {
    this.selectedOption = option;
  }

  itemSelectedInDropdown(data: IDropdownClick) {
    this.searchVal = data.dropdownStr;
    this.topTagSelected({Tags: data.dropdownStr})
    this.getToolOptions();
  }

  itemSearched(val: string) {
    this.searchVal = val;
    this.selectedTags = [];
    this.getToolOptions();
  }

  async getToolOptions() {
    this.toolList = await this.apiCallsService.getHubToolsSearch(this.searchVal).toPromise();
    this.toolList = this.toolList.map((item: any) => ({
      ...item,
      tags: item['Tags'] ? item['Tags'].split(', ') : []
    }));
    if(this.toolList[0]) {
      this.setButtonsCountArray(this.toolList[0]['TotalActionLinks']);
    }
    this.setPaginateData();

    this.changeDetectorRef.detectChanges();
  }

  setButtonsCountArray(totalButtons: number) {
    this.totalButtonsArray = new Array(totalButtons);
  }

  reset() {
    this.toolList = [];
    this.paginatedData = [];
    this.selectedTags = [];
    this.searchVal = '';
  }

  paginate(event: any) {
    this.currentPage = event.page;
    this.setPaginateData();
  }

  setPaginateData() {
    const startPoint = this.currentPage * this.pageSize;
    const endPoint = startPoint + this.pageSize;
    this.paginatedData = [...this.toolList].slice(startPoint, endPoint);
  }


  goToDetails(url: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

  viewTool(tool: ToolSearchAction) {
    this.router.navigate([`apps/${tool['Route']}`])
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


}
