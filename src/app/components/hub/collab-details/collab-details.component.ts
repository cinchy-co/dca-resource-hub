import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AppStateService} from "../../../services/app-state.service";
import {ICollab} from "../model/hub.model";
import {ApiCallsService} from "../../../services/api-calls.service";
import {Router} from "@angular/router";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-collab-details',
  templateUrl: './collab-details.component.html',
  styleUrls: ['./collab-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollabDetailsComponent implements OnInit {
  collabDetails: ICollab;
  collabs: ICollab[];
  items: MenuItem[];
  currentTab: string = 'overview';

  constructor(private appStateService: AppStateService, private appApiService: ApiCallsService,
              private router: Router, private changeDetection: ChangeDetectorRef) {
  }

  async ngOnInit() {
    this.collabDetails = this.appStateService.currentCollab;
    this.setTabItems();
    if (!this.collabDetails) {
      this.collabs = await this.appApiService.getHubCollabs().toPromise();
      this.collabDetails = this.collabs.find(collab => `/${collab.collabRoute}` === this.router.url) as ICollab;
      this.appStateService.currentCollab = this.collabDetails;
      this.changeDetection.detectChanges();
      console.log('111 app , thi', this.appStateService.currentCollab, this.router.url);
    }
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
        label: 'Activities', id: 'activities', icon: 'pi pi-fw pi-cog',
        command: () => {
          this.tabClicked('activities');
        }
      }
    ];
  }

  tabClicked(tabId: string) {
    this.currentTab = tabId;
  }

}
