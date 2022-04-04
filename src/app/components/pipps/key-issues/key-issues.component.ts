import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ReplaySubject, takeUntil} from "rxjs";
import {ApiCallsService} from "../../../services/api-calls.service";
import {IKeyIssues} from "../models/ppips.model";
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "../../../services/window-ref.service";
import {IWebsiteDetails} from "../../../models/common.model";

@Component({
  selector: 'app-key-issues',
  templateUrl: './key-issues.component.html',
  styleUrls: ['./key-issues.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyIssuesComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  keyIssues: IKeyIssues[];
  selectedId: number;
  currentLegislation: string;
  defaultView: boolean;
  currentKeyIssue: IKeyIssues | undefined;
  display = true;
  webSiteDetails: IWebsiteDetails;

  constructor(private router: Router, private route: ActivatedRoute, private apiCallService: ApiCallsService,
              private changeDetectorRef: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService) {
  }

  async ngOnInit() {
    this.webSiteDetails = (await this.apiCallService.getWebsiteDetails('legislation-navigator').toPromise())[0];
    this.route.paramMap.pipe(takeUntil(this.destroyed$)).subscribe(async (params: any) => {
      this.selectedId = params.get('keyIssueId') === 'all' ? 0 : +(params.get('keyIssueId'));
      this.currentLegislation = params.get('legislation');
      this.keyIssues = await this.apiCallService.getKeyIssues(this.currentLegislation).toPromise();
      this.setCurrentKeyIssue();
      this.scrollToTop();
    });
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.scrollTo(0, 0);
    }
  }

  setCurrentKeyIssue() {
    this.defaultView = !this.selectedId;
    if (this.selectedId) {
      this.currentKeyIssue = this.keyIssues.find(issue => issue.id === this.selectedId);
      this.changeDetectorRef.markForCheck();
      return;
    }
    this.currentKeyIssue = undefined;
    this.changeDetectorRef.markForCheck();
  }

  navigateToKeyIssues(issue: IKeyIssues) {
    const issueId = issue.id;
    const urlParams = {legislation: this.currentLegislation};
    this.router.navigate([`tools/privacy-legislation-navigator/keyIssues/${issueId}`, urlParams]);
  }

  navigateToLegislation() {
    const urlParams = {legislation: this.currentLegislation};
    this.router.navigate([`tools/privacy-legislation-navigator`, urlParams]);
  }

  goToAllIssues() {
    const urlParams = {legislation: this.currentLegislation};
    this.router.navigate([`tools/privacy-legislation-navigator/keyIssues/all`, urlParams]);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
