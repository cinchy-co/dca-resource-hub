import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ApiCallsService} from "../../services/api-calls.service";
import {IOption, ILaw, ILawOption} from "./models/ppips.model";
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
  currentLegislationData: ILaw[];
  allSections: Map<any, ILaw[]> = new Map();
  selectedId: number;
  currentArticle: ILaw;
  legislation: IOption[];
  selectedLegislation: IOption;
  currentLegislation: string;
  allLegislationData: { [K: string]: any } = {};
  showIndexPage: boolean;
  currentOpenSection = 0;
  prevNextAndCurrent = {} as {prev: ILaw, next: ILaw, current: ILaw};
  allLaws: ILawOption[];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);


  constructor(private apiCallService: ApiCallsService, private changeDetectorRef: ChangeDetectorRef, private router: Router,
              private route: ActivatedRoute) {
  }

  async ngOnInit() {
    this.allLaws = await this.apiCallService.getAllLegislationLaws().toPromise();
    this.legislation = this.allLaws.map(law => ({...law, code: law.law}));
    this.selectedLegislation = this.legislation[0];
    this.routeSub()
  }

  toggleSidebar() {
    this.display = !this.display;
    this.changeDetectorRef.detectChanges();
  }

  routeSub() {
    this.route.paramMap.pipe(takeUntil(this.destroyed$)).subscribe(async (params: any) => {
      this.selectedId = +(params.get('article'));
      this.currentLegislation = params.get('legislation');
      console.log('ppp this.currentLegislation', this.currentLegislation, this.allLegislationData)
      this.selectedLegislation = this.currentLegislation ?
        this.legislation.find(item => item.code === this.currentLegislation) as IOption : this.selectedLegislation;
      if (this.currentLegislation && !this.selectedId) {
        this.currentArticle = {} as ILaw;
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
    this.currentLegislationData = await this.apiCallService.getLegislationDetails(this.selectedLegislation.id).toPromise();
    this.allSections = this.getSections();
    this.setArticle();
    this.changeDetectorRef.detectChanges();
  }

  setArticle() {
    if (this.selectedId) {
      this.showIndexPage = false;
      const keyForFlatData = `${this.currentLegislation}-flat`;
      this.currentArticle = this.allLegislationData[keyForFlatData].find((article: ILaw) => article.articleNumber === this.selectedId) as ILaw;
      console.log('pppp setArticle this.currentLegislationData', this.currentLegislationData)
      this.setCurrentOpenSection(this.currentArticle);
      this.updatePrevAndBackArticles(this.currentArticle);
    }
  }

  legislationChanged(event: any) {
    const legislation = event.value;
    this.router.navigate(['/legislation', {legislation: legislation.code}], {relativeTo: this.route});
  }

  getSections() {
    const allSections = new Map();
    this.currentLegislationData.forEach(item => {
      const currentObj = allSections.get(item.level2);
      if (currentObj?.length) {
        currentObj.push(item);
        allSections.set(item.level2, currentObj);
      } else {
        allSections.set(item.level2, [item]);
      }
    });
    this.allLegislationData[this.currentLegislation] = allSections;
    const keyForFlatData = `${this.currentLegislation}-flat`
    this.allLegislationData[keyForFlatData] = this.currentLegislationData;
    return allSections;
  }

  setCurrentOpenSection(article: ILaw) {
    console.log('ppp this.allSections', this.allSections, article)
    const allKeys = [...this.allSections.keys()];
    this.currentOpenSection = allKeys.indexOf(article.level2);
  }

  getCategory(section: any): string {
    const currentObj = this.allSections.get(section.key);
    return currentObj ? currentObj[0].label : '';
  }

  goToArticle(article: ILaw) {
    this.setCurrentOpenSection(article);
    let urlParams: any = {article: article.articleNumber};
    if (this.currentLegislation) {
      urlParams = {legislation: this.currentLegislation, ...urlParams};
    }
    this.updatePrevAndBackArticles(article);
    this.router.navigate(['/legislation', urlParams], {relativeTo: this.route});
  }

  updatePrevAndBackArticles(currentArticle: ILaw) {
    const keyForFlatData = `${this.currentLegislation}-flat`;
    const articleIndexInAllArticles = this.allLegislationData[keyForFlatData].findIndex((article: ILaw) => article.id === currentArticle.id);
    this.prevNextAndCurrent.next = this.currentLegislationData[articleIndexInAllArticles + 1];
    this.prevNextAndCurrent.prev = this.currentLegislationData[articleIndexInAllArticles - 1];
  }

  asIsOrder(a: any, b: any) {
    return 1;
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
