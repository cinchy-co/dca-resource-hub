import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ICommunityDetails} from "../../../models/general-values.model";
import {ApiCallsService} from "../../../services/api-calls.service";
import {AppStateService} from "../../../services/app-state.service";
import {IBookmark} from "../model/hub.model";
import {isPlatformBrowser} from "@angular/common";
import {ConfigService} from "../../../config.service";
import {WindowRefService} from "../../../services/window-ref.service";

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {
  toolsHeaderDetails: ICommunityDetails;
  bookmarks: IBookmark[];

  constructor(private appApiService: ApiCallsService, private appStateService: AppStateService,
              private configService: ConfigService, @Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService) {
  }

  async ngOnInit() {
    const communityDetails = this.appStateService.communityDetails;
    this.toolsHeaderDetails = communityDetails.find(item => item.id === 'bookmarks') as ICommunityDetails;
    this.bookmarks = await this.appApiService.getHubBookmarks().toPromise();
  }

  goToBookmark(option: IBookmark) {
    const url = `${this.configService.enviornmentConfig.cinchyRootUrl}${option.fullLink}`;
    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

}
