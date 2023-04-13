import {Injectable, PLATFORM_ID, Inject, Injector} from '@angular/core';
import {GoogleAnalyticsService} from "ngx-google-analytics";
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private _gaService: GoogleAnalyticsService;

  constructor(@Inject(PLATFORM_ID) private readonly _platformId: object, private _injector : Injector) {
    if (isPlatformBrowser(this._platformId)) {
      this._gaService = this._injector.get<GoogleAnalyticsService>(GoogleAnalyticsService);
    }
    // this.tagEachPage();
  }

  onAppLoad() {
    this._gaService?.event('Hub loaded', 'first_load', 'Loaded');
  }

  onRouteChange(route: string) {
    this._gaService?.event('user_entered_video_details_page', 'route_change', route);
  }

  signInUser(user: string) {
    this._gaService?.event('user_entered_video_details_page', 'user', user);
  }


}
