import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable, of, tap} from "rxjs";
import {IUser} from "../models/common.model";
import {CinchyService} from "@cinchy-co/angular-sdk";
import {WindowRefService} from "./window-ref.service";
import {isPlatformBrowser} from "@angular/common";
import {ConfigService} from "../config.service";
import {AppStateService} from "./app-state.service";
import {ToolIds} from "../components/hub/model/hub.model";

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  cachedKeyIssues = {} as any;
  cachedSocialMedia: any[];
  cachedFooterDetails: any[];
  cachedRegulators: any;
  cachedLaws: any;
  cachedTags: any;
  cachedFooterPagesDetails: any = {};

  constructor(private http: HttpClient, private cinchyService: CinchyService, @Inject(PLATFORM_ID) private platformId: any,
              private configService: ConfigService, private appStateService: AppStateService) {
  }

  getHeaderBannerDetails(): Observable<any> {
    const url = '/API/Node%20Zero%20Website/Get%20Node%20Zero%20Website%20Details'
    return this.getResponse(url);
  }

  getLegislation(): Observable<any> {
    const url = '/API/Collaborative%20Privacy/Get%20Privacy%20Legislation%20Grid'
    if (this.cachedLaws) {
      return of(this.cachedLaws);
    } else {
      return this.getResponse(url).pipe(
        tap(resp => this.cachedLaws = resp)
      );
    }
  }

  getDataStewards(): Observable<any> {
    const url = '/API/Collaborative%20Privacy/Get%20Data%20Stewards';
    return this.getResponse(url);
  }

  getPrivacyRegulators(): Observable<any> {
    const url = '/API/Collaborative%20Privacy/Get%20Privacy%20Regulators';
    if (this.cachedRegulators) {
      return of(this.cachedRegulators);
    } else {
      return this.getResponse(url).pipe(
        tap(resp => this.cachedRegulators = resp)
      );
    }
  }

  getNewsFeedAndPodcasts(): Observable<any> {
    const url = '/API/Collaborative%20Privacy/Get%20News%20and%20Podcasts';
    return this.getResponse(url);
  }

  getTags(): Observable<any> {
    const url = '/API/Collaborative%20Privacy/Get%20Tags';
    if (this.cachedTags) {
      return of(this.cachedTags);
    } else {
      return this.getResponse(url).pipe(
        tap(resp => this.cachedTags = resp)
      );
    }
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

  //
  getHubTopNews(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Featured%20News%20Stories`;
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

  getFooterPageDetails(route: string): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Document%20Page%20Details?%40route=${route}`;
    if (this.cachedFooterPagesDetails[route]) {
      return of(this.cachedFooterPagesDetails[route]);
    } else {
      return this.getResponse(url).pipe(
        tap(resp => this.cachedFooterPagesDetails[route] = resp)
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

  getHubCollabs(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Collabs`;
    return this.getResponse(url);
  }

  getCollabStatuses() {
    const url = `/API/Node%20Zero%20Website/Get%20Activity%20Status%20List`;
    return this.getResponse(url);
  }

  getHubCollabMessages(collabId: string): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Collab%20Messages?%40collabId=${collabId}`;
    return this.getResponse(url);
  }

  getHubCollabCommentsPerMessage(msgId: string): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Collab%20Message%20Comments?%40parentId=${msgId}`;
    return this.getResponse(url);
  }

  deleteMessage(messageId: string) {
    const url = `/API/Node%20Zero%20Website/Delete%20Message?%40msgId=${messageId}`;
    return this.getResponse(url);
  }

  getHubCollabOverview(collabId: string): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Collab%20Overview%20Sections?%40collabId=${collabId}`;
    return this.getResponse(url);
  }

  getHubCollabActivities(collabId: string): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20All%20Collab%20Activities?%40collabId=${collabId}`;
    return this.getResponse(url);
  }

  getMyCollabActivities(collabId: string, username: string): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20My%20Collab%20Activities?%40collabId=${collabId}&%40username=${username}`;
    return this.getResponse(url);
  }

  updateEndDate(endDate: any, collabId: string, ): Observable<any> {
    const url = `/API/Node%20Zero%20Community/Add%20End%20Date?%40endDate=${endDate}&%40id=${collabId}`;
    return this.getResponse(url);
  }

  updateStatus(status: any, collabId: string, ): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Update%20Activity%20Status?%40status=${status}&%40id=${collabId}`;
    return this.getResponse(url);
  }

  getCollabMembers(collabId: string, ): Observable<any> {
    const url = `/API/Node%20Zero%20Community/Get%20Collab%20Members%20List?%40id=${collabId}`;
    return this.getResponse(url);
  }

  // https://datacollaboration.net/API/Node%20Zero%20Community/Get%20Collab%20Members%20List?%40id=w

  getHubToolsSearch(tag: string): Observable<any> {
    const url = `/API/Collaborative%20Privacy/Get%20Privacy%20Resources?%40searchStr=${tag}`;
    return this.getResponse(url);
  }

  getHubTools(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Tool%20Page%20Tools`;
    return this.getResponse(url);
  }

  getToolsOverview(toolId: string): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Overview%20Sections?%40toolId=${toolId}`;
    return this.getResponse(url);
  }

  getToolDetails(toolId: string): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Tool%20Overview%20Details?%40toolsId=${toolId}`;
    if (this.appStateService.tool[toolId]) {
      return of(this.appStateService.tool[toolId]);
    }
    return this.getResponse(url).pipe(
      tap(resp => this.appStateService.tool[toolId] = resp)
    );
  }

  getHubTables(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Table%20Page%20Tables`;
    return this.getResponse(url);
  }

  getSuggestionFormQueries(formId: string): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Suggestion%20Form%20Queries?%40formId=${formId}`;
    return this.getResponse(url);
  }

  getFormPageLabels(pageId: string) {
    const url = `/API/Node%20Zero%20Website/Get%20Form%20Labels?%40pageId=${pageId}`;
    return this.getResponse(url);
  }

  getHubEvents(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Upcoming%20Events`;
    if (this.appStateService.hubEvents) {
      return of(this.appStateService.hubEvents);
    }
    return this.getResponse(url).pipe(
      tap(resp => this.appStateService.hubEvents = resp)
    );
  }

  getLearningEvents(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Upcoming%20Learning%20Events`;
    return this.getResponse(url);
  }

  getHubBookmarks(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20My%20Bookmarks`;
    return this.getResponse(url);
  }


  // /API/Node%20Zero%20Website/Get%20Newsfeed%20Filters
  getProfileFormLabels(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Member%20Profile%20Page%20Labels`;
    return this.getResponse(url);
  }

  getProfileDetails(userName: string): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Member%20Profile%20Details?%40userName=${userName}`;
    return this.getResponse(url);
  }

  updateProfilePhoto(photo: string, userName: string): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Update%20Profile%20Photo?%40photo=${photo}&%40username=${userName}`;
    return this.getResponse(url);
  }

  getCinchyProfileDetails(userName: string): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Cinchy%20Profile?%40userName=${userName}`;
    return this.getResponse(url);
  }

  getMemberProfileDetails(memberId: string): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Member%20Profile%20Page?%40memberId=${memberId}`;
    return this.getResponse(url);
  }

  getHubNewsFilter(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Newsfeed%20Filters`;
    return this.getResponse(url);
  }

  saveHubNewsFilter(params: string): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Update%20Filter%20For%20User?%40filters=${params}`;
    return this.getResponse(url);
  }

  getSavedHubNewsFilter(currentUser: string): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Saved%20Filters?%40currentUser=${currentUser}`;
    return this.getResponse(url);
  }

  getHubFeatures(): Observable<any> {
    const url = `/API/Node%20Zero%20Website/Get%20Featured%20Cards`;
    return this.getResponse(url);
  }

  executeCinchyQueries(name: string, domain: string, options?: any, isInsert?: boolean): Observable<any> {
    return this.cinchyService.executeQuery(domain, name, options).pipe(
      map(resp => isInsert ? resp : resp?.queryResult?.toObjectArray())
    );
  }

  async setUserDetails(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let userObjectFromStorageStr;
      if (isPlatformBrowser(this.platformId)) {
        userObjectFromStorageStr = sessionStorage.getItem('id_token_claims_obj');
      }
   //   console.log('IN IF SESSION USER', userObjectFromStorageStr);
      if (userObjectFromStorageStr) {
        const userObjectFromStorage = JSON.parse(userObjectFromStorageStr);
     //   console.log('IN IF 2 SESSION USER', userObjectFromStorageStr);
        const userDetails = await this.getLoggedInUserDetails(userObjectFromStorage.id).toPromise() as IUser[];
     //   console.log('IN IF 2 SESSION userDetails', userDetails)
        resolve(userDetails[0]);
      } else {
       // console.log('IN USER ELSE INSIDE 1', this.cinchyService.getUserIdentity);
        let userDetail = localStorage.getItem('hub-user-details') || '';
        if (isPlatformBrowser(this.platformId)) {
     //     console.log('IN USER ELSE LOCAL');
          userDetail = userDetail ? JSON.parse(userDetail) : null;
          resolve(userDetail);
        }
        if (!userDetail) {
          this.cinchyService.getUserIdentity().subscribe(async (user: any) => {
         //   console.log('IN USER ELSE INSIDE', user);
            if (user?.id) {
           //   console.log('IN USER ELSE INSIDE ID', user);
              const userDetailsIdentity = await this.getLoggedInUserDetails(user.id).toPromise() as IUser[];
             // console.log('IN USER ELSE INSIDE ID userDetailsIdentity', userDetailsIdentity);
              resolve(userDetailsIdentity[0]);
            } else {
             // console.log('IN USER ELSE INSIDE ID userDetailsIdentity REJECT');
              reject('No user details');
            }
          }, error => {
            console.log('IN REJECT')
            reject('No user details');
          });
        }
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
    data?.forEach((row: any) => {
      let rowObject: any = {};
      for (let i = 0; i < row.length; i++) {
        rowObject[schema[i].columnName] = row[i];
      }
      result.push(rowObject);
    });
    return result;
  }

  logOut() {
    const cookies = document.cookie.split("; ");
    for (let c = 0; c < cookies.length; c++) {
      const d = window.location.hostname.split(".");
      while (d.length > 0) {
        const cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
        const p = location.pathname.split('/');
        document.cookie = cookieBase + '/';
        while (p.length > 0) {
          document.cookie = cookieBase + p.join('/');
          p.pop();
        }
        d.shift();
      }
    }
  }

}
