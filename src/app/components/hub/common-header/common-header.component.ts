import {Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {ICommunityDetails} from "../../../models/general-values.model";
import {isPlatformBrowser} from "@angular/common";
import {AppStateService} from "../../../services/app-state.service";
import {WindowRefService} from "../../../services/window-ref.service";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss']
})
export class CommonHeaderComponent implements OnInit {
  @Input() headerDetails: ICommunityDetails;
  totalButtonsArray: number[];

  constructor(private appStateService: AppStateService, @Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService) {
  }

  ngOnInit(): void {
    this.setButtonsCountArray(this.headerDetails.numberOfButtons);
  }

  getIcon(option: ICommunityDetails, isCollapsed?: boolean): IconProp {
    const iconToTake = isCollapsed ? option.collapseIcon : option.faIcon;
    return iconToTake?.split(',') as IconProp;
  }

  goToDetails(url: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

  setButtonsCountArray(totalButtons: number) {
    this.totalButtonsArray = new Array(totalButtons);
  }

}
