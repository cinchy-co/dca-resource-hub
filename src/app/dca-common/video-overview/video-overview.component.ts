import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {IdTypes, ITools, IToolSection, ToolIds} from "../../components/hub/model/hub.model";
import {combineLatest, Observable, of, take} from "rxjs";
import {ApiCallsService} from "../../services/api-calls.service";
import {WindowRefService} from "../../services/window-ref.service";
import {isPlatformBrowser} from "@angular/common";
import {AppStateService} from "../../services/app-state.service";

@Component({
  selector: 'app-video-overview',
  templateUrl: './video-overview.component.html',
  styleUrls: ['./video-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoOverviewComponent implements OnInit {
  @Input() toolId: ToolIds | string;
  @Input() childToolId: ToolIds | string;
  @Input() toolDetails: ITools; // need to remove
  toolsOverviewSections: IToolSection[];
  toolsOverviewSectionsDetails: IToolSection[];
  allQueriesObs: any;

  constructor(private apiCallsService: ApiCallsService, private windowRef: WindowRefService,
              private appStateService: AppStateService, private changeDetectorRef: ChangeDetectorRef,
              @Inject(PLATFORM_ID) private platformId: any) {
  }

  ngOnInit(): void {
    if (this.toolId) {
      if (this.appStateService.toolsOverview[this.toolId]) {
        this.toolsOverviewSectionsDetails = this.appStateService.toolsOverview[this.toolId];
        this.changeDetectorRef.detectChanges();
      } else {
        this.apiCallsService.getToolsOverview(this.toolId).pipe(take(1))
          .subscribe(toolSections => {
            this.toolsOverviewSections = toolSections;
            this.setToolSectionsAndGetDetails();
          });
      }
    }
  }

  setToolSectionsAndGetDetails() {
    const allObs: Observable<any>[] = []
    this.toolsOverviewSections.forEach(section => {
      if (section.sectionValue) {
        allObs.push(of(section.sectionValue));
      } else {
        const params = {
          '@id': this.childToolId ? this.childToolId : this.toolId
        }
        const obs = this.apiCallsService.executeCinchyQueries(section.queryName, section.queryDomain, params);
        allObs.push(obs);
      }
    })
    combineLatest(allObs).pipe(take(1)).subscribe(values => {
      console.log('111 OVERVIEW VALUES', values);
      this.toolsOverviewSectionsDetails = this.toolsOverviewSections.map((section, i) => {
        return {...section, details: values[i]};
      });
      const toolIdToSave = this.childToolId ? this.childToolId : this.toolId;
      this.appStateService.toolsOverview[toolIdToSave] = this.toolsOverviewSectionsDetails;
      console.log('1111 SECTIONS', this.toolsOverviewSectionsDetails);
      this.changeDetectorRef.detectChanges();
    });
  }

  getCols(tableFirstRow: any): string[] {
    return Object.keys(tableFirstRow);
  }

  goToSelection(item: any) {
    if (isPlatformBrowser(this.platformId)) {
      const url = item.cardLink;
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

  goToDetails(item: any) {
    if (isPlatformBrowser(this.platformId)) {
      const url = item.logoLink;
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

}
