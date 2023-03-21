import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";

function _window(): any {
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class WindowRefService {

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) { }

  get nativeWindow(): any {
    if(isPlatformBrowser(this.platformId)) {
      return _window();
    }
  }

  isSSR(): boolean {
    return  !isPlatformBrowser(this.platformId);
  }

  getOperatingSystem(): string {
    if(isPlatformBrowser(this.platformId)) {
      let OS = "Unknown";
      if (navigator.userAgent.indexOf("Win")!=-1) OS="Windows";
      if (navigator.userAgent.indexOf("Mac")!=-1) OS="MacOS";
      if (navigator.userAgent.indexOf("X11")!=-1) OS="UNIX";
      if (navigator.userAgent.indexOf("Linux")!=-1) OS="Linux";
      return OS;
    }
    return 'Windows'
  }
}
