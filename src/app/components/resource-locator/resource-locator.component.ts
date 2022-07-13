import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {take} from "rxjs";
import {ApiCallsService} from "../../services/api-calls.service";
import {AppStateService} from "../../services/app-state.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ITools} from "../hub/model/hub.model";
import {IDropdownClick, IOption, ITag} from "../../models/common.model";
import {SearchByTag} from "../../models/general-values.model";

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


  constructor(private apiCallsService: ApiCallsService, private appStateService: AppStateService,
              private activatedRoute: ActivatedRoute, private router: Router,
              private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.setTabItems();
    this.getTags();
    this.apiCallsService.getToolDetails(this.toolId).pipe(take(1)).subscribe(tool => {
      this.toolDetails = tool[0];
      this.changeDetectorRef.detectChanges();
    });
  }

  async getTags() {
    this.tags = await this.apiCallsService.getTags().toPromise();
    this.top20Tags = this.tags.filter(tag => tag.TopTags === 'Yes');
    console.log('111 TAGS', this.tags);
    this.changeDetectorRef.detectChanges();
  }

  topTagSelected(tag: ITag) {
    const isAlreadyPresent = this.selectedTags.find(stag => stag.Tags === tag.Tags);
    if (isAlreadyPresent) {
      this.selectedTags = this.selectedTags.filter(stag => stag.Tags !== tag.Tags);
    } else {
      this.selectedTags.push(tag);
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
  }

  itemSearched(val: string) {
    this.searchVal = val;
  }

  reset() {
    this.searchVal = '';
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
