import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable, of, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  cachedKeyIssues = {} as any;

  constructor(private http: HttpClient) {
  }

  getHeaderBannerDetails(): Observable<any> {
    const url = 'https://datacollaboration.net/API/Node%20Zero%20Website/Get%20Node%20Zero%20Website%20Details'
    return this.getResponse(url);
  }

  getLegislation(): Observable<any> {
    const url = 'https://datacollaboration.net/API/Collaborative%20Privacy/Get%20Privacy%20Legislation%20Grid'
    return this.getResponse(url);
  }

  getDataStewards(): Observable<any> {
    const url = 'https://datacollaboration.net/API/Collaborative%20Privacy/Get%20Data%20Stewards';
    return this.getResponse(url);
  }

  getPrivacyRegulators(): Observable<any> {
    const url = 'https://datacollaboration.net/API/Collaborative%20Privacy/Get%20Privacy%20Regulators';
    return this.getResponse(url);
  }

  getNewsFeedAndPodcasts(): Observable<any> {
    const url = 'https://datacollaboration.net/API/Collaborative%20Privacy/Get%20News%20and%20Podcasts';
    return this.getResponse(url);
  }

  getTags(): Observable<any> {
    const url = 'https://datacollaboration.net/API/Collaborative%20Privacy/Get%20Tags';
    return this.getResponse(url);
  }

  getAllLegislationLaws(): Observable<any> {
    const url = 'https://datacollaboration.net/API/Collaborative%20Privacy/Get%20All%20Legislations';
    return this.getResponse(url);
  }

  getWebsiteDetails(routeId: string) {
    const url = `https://datacollaboration.net/API/Collaborative%20Privacy/Get%20Website%20Map%20by%20Route%20Id?%40routeId=${routeId}`;
    return this.getResponse(url);
  }

  getLegislationDetails(law: string): Observable<any> {
    const url = `https://datacollaboration.net/API/Collaborative%20Privacy/Get%20Legislation%20Details?%40law=${law}`;
    return this.getResponse(url);
  }

  getKeyIssues(law: string): Observable<any> {
    const url = `https://datacollaboration.net/API/Collaborative%20Privacy/Get%20Key%20Issues?%40law=${law}`;
    if (this.cachedKeyIssues[law]) {
      return of(this.cachedKeyIssues[law]);
    } else {
      return this.getResponse(url).pipe(
        tap(resp => this.cachedKeyIssues[law] = resp)
      );
    }
  }

  getResponse(url: string): Observable<any> {
    return this.http.get(url, {
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
