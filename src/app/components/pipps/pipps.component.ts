import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ApiCallsService} from "../../services/api-calls.service";
import {IOption, IPpips, Legislation} from "./models/ppips.model";
import {ActivatedRoute, Router} from "@angular/router";
import {ReplaySubject, takeUntil} from "rxjs";

@Component({
  selector: 'app-pipps',
  templateUrl: './pipps.component.html',
  styleUrls: ['./pipps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PippsComponent implements OnInit, OnDestroy {
  display = true;
  currentLegislationData: IPpips[];
  allSections: Map<any, IPpips[]> = new Map();
  selectedId: string;
  currentArticle: IPpips;
  legislation = Legislation;
  selectedLegislation: IOption = Legislation[0];
  currentLegislation: string;
  allLegislationData: { [K: string]: any } = {};
  showIndexPage: boolean;
  currentOpenSection = 0;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);


  constructor(private apiCallService: ApiCallsService, private changeDetectorRef: ChangeDetectorRef, private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.routeSub()
  }

  routeSub() {
    this.route.paramMap.pipe(takeUntil(this.destroyed$)).subscribe(async (params: any) => {
      this.selectedId = params.get('article');
      this.currentLegislation = params.get('legislation');
      this.selectedLegislation = this.currentLegislation ?
        this.legislation.find(item => item.code === this.currentLegislation) as IOption : this.selectedLegislation;
      if (this.currentLegislation && !this.selectedId) {
        this.currentArticle = {} as IPpips;
        this.getDataAndCreateSections();
      } else { //default if no url params present
        this.getDataAndCreateSections();
      }
    });
  }

  async getDataAndCreateSections() {
    this.showIndexPage = true;
    if (this.allLegislationData[this.currentLegislation]) {
      this.allSections = this.allLegislationData[this.currentLegislation];
      this.setArticle();
      return;
    }
    this.currentLegislationData = await this.apiCallService.getPpips().toPromise();
    this.allSections = this.getSections();
    this.setArticle();
    this.changeDetectorRef.detectChanges();
    console.log('ppp- ALL SECTIONS', this.allSections);
  }

  setArticle() {
    if (this.selectedId) {
      this.showIndexPage = false;
      this.currentArticle = this.currentLegislationData.find(article => article.article === this.selectedId) as IPpips;
      this.setCurrentOpenSection(this.currentArticle);
    }
  }

  legislationChanged(event: any) {
    const legislation = event.value;
    this.router.navigate(['/legislation', {legislation: legislation.code}], {relativeTo: this.route});
  }

  getSections() {
    const allSections = new Map();
    this.currentLegislationData.forEach(item => {
      const currentObj = allSections.get(item.division);
      if (currentObj?.length) {
        currentObj.push(item);
        allSections.set(item.division, currentObj);
      } else {
        allSections.set(item.division, [item]);
      }
    });
    this.allLegislationData[this.currentLegislation] = allSections;
    return allSections;
  }

  setCurrentOpenSection(article: IPpips) {
    const allKeys = [...this.allSections.keys()];
    this.currentOpenSection = allKeys.indexOf(article.division);
  }

  getCategory(section: any): string {
    const currentObj = this.allSections.get(section.key);
    return currentObj ? currentObj[0].category : '';
  }

  goToArticle(article: IPpips) {
    this.setCurrentOpenSection(article);
    let urlParams: any = {article: article.article};
    if (this.currentLegislation) {
      urlParams = {legislation: this.currentLegislation, ...urlParams};
    }
    this.router.navigate(['/legislation', urlParams], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
