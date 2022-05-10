import {Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {ITools, IToolSection, ToolIds} from "../../components/hub/model/hub.model";
import {combineLatest, Observable, of, take} from "rxjs";
import {ApiCallsService} from "../../services/api-calls.service";
import {WindowRefService} from "../../services/window-ref.service";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-video-overview',
  templateUrl: './video-overview.component.html',
  styleUrls: ['./video-overview.component.scss']
})
export class VideoOverviewComponent implements OnInit {
  @Input() toolId: ToolIds;
  @Input() toolDetails: ITools; // need to remove
  toolsOverviewSections: IToolSection[];
  toolsOverviewSectionsDetails: IToolSection[];
  allQueriesObs: any;

  constructor(private apiCallsService: ApiCallsService, private windowRef: WindowRefService,
              @Inject(PLATFORM_ID) private platformId: any) {
  }

  ngOnInit(): void {
    if (this.toolId) {
      this.apiCallsService.getToolsOverview(this.toolId).pipe(take(1))
        .subscribe(toolSections => {
          this.toolsOverviewSections = toolSections;
          this.setToolSectionsAndGetDetails();
        });
    }
  }

  setToolSectionsAndGetDetails() {
    const allObs: Observable<any>[] = []
    this.toolsOverviewSections.forEach(section => {
      if (section.sectionValue) {
        allObs.push(of(section.sectionValue));
      } else {
        const params = {
          '@toolsId': 'privacy-law-navigator'
        }
        const obs = this.apiCallsService.executeCinchyQueries(section.queryName, section.queryDomain, params);
        allObs.push(obs);
      }
    })
    combineLatest(allObs).pipe(take(1)).subscribe(values => {
      this.toolsOverviewSectionsDetails = this.toolsOverviewSections.map((section, i) => {
        return {...section, details: values[i]};
      });
      console.log('qqqqqqqqqqqqqq', this.toolsOverviewSectionsDetails);
    });
  }

  getCols(tableFirstRow: any): string[] {
    return Object.keys(tableFirstRow);
  }

  goToSelection(item: any) {

  }
  goToDetails(item: any) {
    if (isPlatformBrowser(this.platformId)) {
      const url = item.logoLink;
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

}
