import {Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiCallsService} from "../../../services/api-calls.service";
import {IGettingStarted} from "../model/hub.model";
import {combineLatest, Observable, ObservableInput, of, ReplaySubject, take, takeUntil} from "rxjs";
import {PageScrollService} from "ngx-page-scroll-core";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GettingStartedComponent implements OnInit, OnDestroy {
  currentPage: string;
  pageDetails: IGettingStarted[];
  mappedPageDetails: IGettingStarted[];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private activatedRoute: ActivatedRoute, private apiCallsService: ApiCallsService,
              private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any) {
  }


  async ngOnInit() {
    this.activatedRoute.paramMap.pipe(takeUntil(this.destroyed$)).subscribe(async (params: any) => {
      this.currentPage = params.get('route') as string;
      this.pageDetails = await this.apiCallsService.getFooterPageDetails(this.currentPage).toPromise();
      this.setMappedDetailsWithTableData();
    });

    this.pageScrollService.scroll({
      document: this.document,
      scrollTarget: '.theEnd',
    });
  }

  setMappedDetailsWithTableData() {
    const allObs: Observable<any>[] = [];
    this.pageDetails.forEach(page => {
      const tableDomain = page.tableQueryDomain;
      if (tableDomain) {
        const tableObs = this.apiCallsService.executeCinchyQueries(page.tableQueryName, page.tableQueryDomain);
        allObs.push(tableObs)
      } else {
        allObs.push(of(null))
      }
    });
    combineLatest(allObs).pipe(take(1)).subscribe(values => {
      this.mappedPageDetails = this.pageDetails.map((section, i) => {
        return {...section, tableDetails: values[i]};
      });
    });
  }

  getCols(tableFirstRow: any): string[] {
    return Object.keys(tableFirstRow);
  }

  getId(str: string): string {
    return str.replace(/\s/g, '');
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
