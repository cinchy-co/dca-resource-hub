import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable, of, tap} from "rxjs";
import {IUser} from "../models/common.model";
import {CinchyService} from "@cinchy-co/angular-sdk";
import {WindowRefService} from "./window-ref.service";
import {isPlatformBrowser} from "@angular/common";
import {ConfigService} from "../config.service";

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  cachedKeyIssues = {} as any;
  cachedSocialMedia: any[];
  cachedFooterDetails: any[];

  constructor(private http: HttpClient, private cinchyService: CinchyService, @Inject(PLATFORM_ID) private platformId: any,
              private configService: ConfigService) {
  }

  getHeaderBannerDetails(): Observable<any> {
    const url = '/API/Node%20Zero%20Website/Get%20Node%20Zero%20Website%20Details'
    return this.getResponse(url);
  }

  getLegislation(): Observable<any> {
    const url = '/API/Collaborative%20Privacy/Get%20Privacy%20Legislation%20Grid'
    return this.getResponse(url);
  }

  getDataStewards(): Observable<any> {
    const url = '/API/Collaborative%20Privacy/Get%20Data%20Stewards';
    return this.getResponse(url);
  }

  getPrivacyRegulators(): Observable<any> {
    const url = '/API/Collaborative%20Privacy/Get%20Privacy%20Regulators';
    return this.getResponse(url);
  }

  getNewsFeedAndPodcasts(): Observable<any> {
    const url = '/API/Collaborative%20Privacy/Get%20News%20and%20Podcasts';
    return this.getResponse(url);
  }

  getTags(): Observable<any> {
    const url = '/API/Collaborative%20Privacy/Get%20Tags';
    return this.getResponse(url);
  }

  getAllLegislationLaws(): Observable<any> {
    const url = '/API/Collaborative%20Privacy/Get%20All%20Legislations';
    return this.getResponse(url);
  }

  getWebsiteDetails(routeId: string) {
    const url = `/API/Collaborative%20Privacy/Get%20Website%20Map%20by%20Route%20Id?%40routeId=${routeId}`;
    return this.getResponse(url);
  }

  getLegislationDetails(law: string): Observable<any> {
    const url = `/API/Collaborative%20Privacy/Get%20Legislation%20Details?%40law=${law}`;
    return this.getResponse(url);
  }

  getKeyIssues(law: string): Observable<any> {
    const url = `/API/Collaborative%20Privacy/Get%20Key%20Issues?%40law=${law}`;
    if (this.cachedKeyIssues[law]) {
      return of(this.cachedKeyIssues[law]);
    } else {
      return this.getResponse(url).pipe(
        tap(resp => this.cachedKeyIssues[law] = resp)
      );
    }
  }


  // HUB
  getCommunityPageDetails(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Community%20Page%20Details`;
    return this.getResponse(url);
  }

  getFooterDetails(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Footer%20Details`;
    if (this.cachedFooterDetails) {
      return of(this.cachedFooterDetails);
    } else {
      return this.getResponse(url).pipe(
        tap(resp => this.cachedFooterDetails = resp)
      );
    }
  }

  getSocialMediaDetails(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Social%20Media%20Details`;
    if (this.cachedSocialMedia) {
      return of(this.cachedSocialMedia);
    } else {
      return this.getResponse(url).pipe(
        tap(resp => this.cachedSocialMedia = resp)
      );
    }
  }

  getHubNewsfeed(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Community%20Newsfeed`;
    return this.getResponse(url);
  }

  getHubTools(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Tool%20Page%20Tools`;
    return this.getResponse(url);
  }

  getHubTables(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Table%20Page%20Tables`;
    return this.getResponse(url);
  }

  getSuggestionFormQueries(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Suggestion%20Form%20Queries`;
    return this.getResponse(url);
  }

  getHubEvents(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Upcoming%20Events`;
    return this.getResponse(url);
  }

  getLearningEvents(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Upcoming%20Learning%20Events`;
    return this.getResponse(url);
  }

  getHubBookmarks(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20My%20Bookmarks`;
    return this.getResponse(url);
  }

  executeCinchyQueries(name: string, domain: string, options?: any): Observable<any> {
   return this.cinchyService.executeQuery(domain, name, options).pipe(
     map(resp => resp.queryResult.toObjectArray())
   );
  }

  async setUserDetails(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let userObjectFromStorageStr;
      if (isPlatformBrowser(this.platformId)) {
        userObjectFromStorageStr = sessionStorage.getItem('id_token_claims_obj');
      }
      if (userObjectFromStorageStr) {
        const userObjectFromStorage = JSON.parse(userObjectFromStorageStr);
        const userDetails = await this.getLoggedInUserDetails(userObjectFromStorage.id).toPromise() as IUser[];
        resolve(userDetails[0]);
      } else {
        this.cinchyService.getUserIdentity().subscribe(async (user: any) => {
          console.log('IN USER ELSE INSIDE', user)
          if (user?.id) {
            const userDetailsIdentity = await this.getLoggedInUserDetails(user.id).toPromise() as IUser[];
            resolve(userDetailsIdentity[0]);
          } else {
            reject('No user details');
          }
        }, error => {
          console.log('IN REJECT')
          reject('No user details');
        });
      }
    })
  }

  getLoggedInUserDetails(userName: string): Observable<IUser[]> {
    const url = `/API/Node%20Zero%20Website/Get%20User%20Details?%40userName=${userName}`;
    return this.getResponse(url);
  }

  getResponse(url: string): Observable<any> {
    const fullUrl = `${this.configService.enviornmentConfig.cinchyRootUrl}${url}`
    return this.http.get(fullUrl, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      responseType: 'text'
    }).pipe(
      map(resp => {
        const {data, schema} = JSON.parse(resp);
        return this.toObjectArray(data, schema);
      }))
  }

  toObjectArray(data: any, schema: any): Array<Object> {
    let result: any = [];
    data.forEach((row: any) => {
      let rowObject: any = {};
      for (let i = 0; i < row.length; i++) {
        rowObject[schema[i].columnName] = row[i];
      }
      result.push(rowObject);
    });
    return result;
  }

}
