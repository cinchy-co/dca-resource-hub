import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Cinchy} from "@cinchy-co/angular-sdk";
import {ILegislation} from "../models/common.model";

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {

  constructor(private http: HttpClient) {
  }

  getLegislation(): Observable<any> {
    const url = 'https://datacollaboration.net/API/Collaborative%20Privacy/Get%20Privacy%20Legislation%20Grid'
    return this.http.get(url, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      responseType: 'text'
    }).pipe(
      map(resp => {
        const queryResult = new Cinchy.QueryResult(resp);
        const {data, schema} = JSON.parse(queryResult._jsonResult);
        return this.toObjectArray(data, schema);
      }))
  }

  getDataStewards(): Observable<any> {
    const url = 'https://datacollaboration.net/API/Collaborative%20Privacy/Get%20Data%20Stewards';
    return this.http.get(url, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      responseType: 'text'
    }).pipe(
      map(resp => {
        const queryResult = new Cinchy.QueryResult(resp);
        const {data, schema} = JSON.parse(queryResult._jsonResult);
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
