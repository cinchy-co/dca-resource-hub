import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {IDropdownClick, IOption} from "../models/common.model";

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  search$: Subject<string> = new Subject<string>();
  reset$: Subject<boolean> = new Subject<boolean>();
  dropdownOptionClicked$: BehaviorSubject<IDropdownClick> = new BehaviorSubject<IDropdownClick>({dropdownStr: '', countrySelected: ''});

  constructor() {
  }

  setSearch(val: string) {
    this.search$.next(val);
  }

  getSearchEnteredVal() {
    return this.search$.asObservable();
  }

  setReset(val: boolean) {
    this.reset$.next(val);
  }

  getReset() {
    return this.reset$.asObservable();
  }

  setDropdownOption(val: IDropdownClick) {
    this.dropdownOptionClicked$.next(val);
  }

  getDropdownOption() {
    return this.dropdownOptionClicked$.asObservable();
  }

  getUniqueOptions(dataForOptions: any, selectedOption: IOption) {
    const key = selectedOption.code;
    const uniqueOptions = [...new Set(dataForOptions.map((item: any) => {
      return item[key];
    }))];
    return (uniqueOptions.filter(item => item)).map(optionItem => {
      const newDropdownList: any = {};
      newDropdownList[key] = optionItem;
      return newDropdownList;
    });
  }
}
