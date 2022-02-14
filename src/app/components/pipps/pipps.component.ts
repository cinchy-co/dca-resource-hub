import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ApiCallsService} from "../../services/api-calls.service";
import {IPpips} from "./models/ppips.model";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-pipps',
  templateUrl: './pipps.component.html',
  styleUrls: ['./pipps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PippsComponent implements OnInit {
  display = true;
  ppipsData: IPpips[];
  allSections: Map<any, IPpips[]> = new Map();
  selectedId: string;
  currentArticle: IPpips;

  constructor(private apiCallService: ApiCallsService, private changeDetectorRef: ChangeDetectorRef, private router: Router,
              private route: ActivatedRoute) {
  }

  async ngOnInit() {
    this.ppipsData = await this.apiCallService.getPpips().toPromise();
    this.createSections();
    this.route.paramMap.subscribe((params: any) => {
        this.selectedId = params.get('article');
        this.currentArticle = this.ppipsData.find(article => article.article === this.selectedId) as IPpips;
      });
  }

  createSections() {
    const allSections = new Map();
    this.ppipsData.forEach(item => {
      const currentObj = allSections.get(item.division);
      if (currentObj?.length) {
        currentObj.push(item);
        allSections.set(item.division, currentObj);
      } else {
        allSections.set(item.division, [item]);
      }
    });
    this.allSections = allSections;
    this.changeDetectorRef.detectChanges();
  }

  getCategory(section: any): string {
    const currentObj = this.allSections.get(section.key);
    return currentObj ? currentObj[0].category : '';
  }

  goToArticle(article: IPpips) {
    this.router.navigate(['/ppips', {article: article.article}],  { relativeTo: this.route });
  }

}
