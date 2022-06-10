import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import {AppStateService} from "../../../services/app-state.service";
import {IActivity, ICollab} from "../model/hub.model";
import {ApiCallsService} from "../../../services/api-calls.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MenuItem} from "primeng/api";
import {ReplaySubject, take, takeUntil} from "rxjs";
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "../../../services/window-ref.service";
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-collab-details',
  templateUrl: './collab-details.component.html',
  styleUrls: ['./collab-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({height: 0, opacity: 0}),
            animate('200ms ease-out',
              style({height: 300, opacity: 1}))
          ]
        ),
        transition(
          ':leave',
          [
            style({height: 300, opacity: 1}),
            animate('200ms ease-in',
              style({height: 0, opacity: 0}))
          ]
        )
      ]
    )
  ]
})
export class CollabDetailsComponent implements OnInit, OnDestroy {
  collabDetails: ICollab;
  collabs: ICollab[];
  items: MenuItem[];
  currentTab: string = 'overview';
  currentMenuItem: MenuItem;
  activities: IActivity[];
  expansionState: any = {};
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private appStateService: AppStateService, private appApiService: ApiCallsService,
              private router: Router, private changeDetection: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService, private activatedRoute: ActivatedRoute) {
  }

  async ngOnInit() {
    this.collabDetails = this.appStateService.currentCollab;
    this.setTabItems();
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
      this.currentTab = params['tab'] ? params['tab'].toLowerCase() : 'overview';
      this.currentMenuItem = this.items.find(item => item.id === this.currentTab) || this.items[0];
    });

    if (!this.collabDetails?.collabId) {
      this.collabs = await this.appApiService.getHubCollabs().toPromise();
      this.collabDetails = this.collabs.find(collab => `/${collab.collabRoute}` === this.router.url.split('?')[0]) as ICollab;
      this.appStateService.currentCollab = this.collabDetails;
      this.getCollabActivities();
    } else {
      this.getCollabActivities();
    }
  }

  getCollabActivities() {
    this.appApiService.getHubCollabActivities(this.collabDetails.collabId).pipe(take(1)).subscribe(activities => {
      this.activities = activities;
      console.log('ppp activities', activities);
      this.changeDetection.detectChanges();
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

  goToActivity(activity: IActivity) {
    const url = activity.link;
    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

  toggleExpansions(activity: IActivity) {
    this.expansionState[activity.cinchyId] = !this.expansionState[activity.cinchyId];
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
