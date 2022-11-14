import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {isPlatformBrowser} from "@angular/common";
import {AppStateService} from "./services/app-state.service";

@Injectable({
  providedIn: 'root'
})
export class ApiInterceptorService implements HttpInterceptor {

  constructor(@Inject(PLATFORM_ID) private platformId: any, private appStateService: AppStateService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // let headers =  new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    req = req.clone({headers: req.headers.set('Content-Type', 'application/x-www-form-urlencoded')});
    if (isPlatformBrowser(this.platformId)) {
      const isLoggedIn = sessionStorage.getItem('nonce') || sessionStorage.getItem('is-logged-in');
      if (!isLoggedIn) {
        req = req.clone({headers: req.headers.delete('Authorization')});
      } else {
        const authorization = req.headers.get('Authorization');
        const authorizationHeader = sessionStorage.getItem('authorizationHeader');
        if (!this.appStateService.authorizationHeader && !authorization?.includes('null')) {
          this.appStateService.authorizationHeader = authorizationHeader?.includes('null') ? authorization : authorizationHeader;
          sessionStorage.setItem('authorizationHeader', `${this.appStateService.authorizationHeader}`);
        } else if (this.appStateService.authorizationHeader || authorizationHeader && authorizationHeader !== 'null') {
          const authorization = this.appStateService.authorizationHeader || authorizationHeader;
          req = req.clone({headers: req.headers.set('Authorization', authorization)});
        }
      }
    }
    const finalAuthorization = req.headers.get('Authorization');

    if (finalAuthorization?.includes('null')) {
      req = req.clone({headers: req.headers.delete('Authorization')});
    }
    return next.handle(req);
  }
}
