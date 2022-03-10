import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import {ApiCallsService} from "../../services/api-calls.service";
import {IOption, ILaw, ILawOption, IKeyIssues} from "./models/ppips.model";
import {ActivatedRoute, Router} from "@angular/router";
import {ReplaySubject, takeUntil} from "rxjs";
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "../../services/window-ref.service";

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
  showSectionDetails: boolean;
  currentSectionDetails: { key: string, value: ILaw[] }
  currentOpenSection = 0;
  prevNextAndCurrent = {} as { prev: ILaw, next: ILaw, current: ILaw };
  allLaws: ILawOption[];
  keyIssues: IKeyIssues[];
  allLawsKeyIssues: { [K: string]: IKeyIssues[] } = {};
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);


  constructor(private apiCallService: ApiCallsService, private changeDetectorRef: ChangeDetectorRef, private router: Router,
              private route: ActivatedRoute, @Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService) {
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
      this.selectedLegislation = this.currentLegislation ?
        this.legislation.find(item => item.code === this.currentLegislation) as IOption : this.selectedLegislation;
      this.currentLegislation = this.selectedLegislation.code;
      this.currentArticle = {} as ILaw;
      this.getDataAndCreateSections();
      this.scrollToTop();
    });
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.scrollTo(0, 0);
    }
  }

  async getDataAndCreateSections() {
    this.showIndexPage = true;
    if (this.allLegislationData[this.currentLegislation]) {
      this.allSections = this.allLegislationData[this.currentLegislation];
      this.keyIssues = this.allLawsKeyIssues[this.currentLegislation];
      this.setArticle();
      return;
    }
    this.currentLegislationData = await this.apiCallService.getLegislationDetails(this.selectedLegislation.code).toPromise();
    this.currentLegislationData = this.currentLegislationData.map(item => ({...item, tagsArr: item?.tags?.split(',')}));
    console.log('ppp this.currentLegislationData', this.currentLegislationData)
    this.keyIssues = await this.apiCallService.getKeyIssues(this.selectedLegislation.code).toPromise();
    this.allLawsKeyIssues[this.currentLegislation] = this.keyIssues;
    this.allSections = this.getSections();
    this.setArticle();
    this.changeDetectorRef.detectChanges();
  }

  setArticle() {
    if (this.selectedId) {
      this.showIndexPage = false;
      const keyForFlatData = `${this.currentLegislation}-flat`;
      this.currentArticle = this.allLegislationData[keyForFlatData].find((article: ILaw) => article.articleNumber === this.selectedId) as ILaw;
      this.setCurrentOpenSection(this.currentArticle);
      this.updatePrevAndBackArticles(this.currentArticle);
    }
  }

  legislationChanged(event: any) {
    this.showIndexPage = true;
    this.showSectionDetails = false;
    const legislation = event.value;
    this.router.navigate(['/legislation', {legislation: legislation.code}], {relativeTo: this.route});
  }

  getSections() {
    const allSections = new Map();
    this.currentLegislationData.forEach(item => {
      const currentObj = allSections.get(item.level2);
      if (currentObj?.length) {
        const isLevel3AlreadyPresent = currentObj.find((sectionItem: ILaw) => sectionItem.level3 === item.level3);
        if (item.level3 && !isLevel3AlreadyPresent) {
          const level3Item = {...item, isLevel3: true};
          currentObj.push(level3Item);
        }
        currentObj.push(item);
        allSections.set(item.level2, currentObj);
      } else {
        const itemsToSet = [];
        if (item.level3) {
          const level3Item = {...item, isLevel3: true};
          itemsToSet.push(level3Item);
        }
        itemsToSet.push(item);
        allSections.set(item.level2, itemsToSet);
      }
    });
    this.allLegislationData[this.currentLegislation] = allSections;
    const keyForFlatData = `${this.currentLegislation}-flat`
    this.allLegislationData[keyForFlatData] = this.currentLegislationData;
    return allSections;
  }

  setCurrentOpenSection(article: ILaw) {
    this.showSectionDetails = false;
    const allKeys = [...this.allSections.keys()];
    this.currentOpenSection = allKeys.indexOf(article.level2);
  }

  getCategory(section: any): string {
    const currentObj = this.allSections.get(section.key);
    return currentObj ? currentObj[0].label : '';
  }

  sectionClicked(section: any, index: number) {
    console.log('ppp section', section, index)
    this.currentOpenSection = index;
    this.showSectionDetails = true;
    this.showIndexPage = false;
    this.currentSectionDetails = section;
    this.scrollToTop();
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

  navigateToKeyIssues(issue?: IKeyIssues) {
    const urlParams = {legislation: this.currentLegislation};
    if (!issue) {
      this.router.navigate([`/legislation/keyIssues/all`, urlParams]);
      return ;
    }
    const issueId = issue.id;
    this.router.navigate([`/legislation/keyIssues/${issueId}`, urlParams]);
  }

  asIsOrder(a: any, b: any) {
    return 1;
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
