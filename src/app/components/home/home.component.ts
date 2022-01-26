import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ApiCallsService} from "../../services/api-calls.service";
import {IAvatar, ILegislation, IOption} from "../../models/common.model";
import {SearchBy} from "../../models/general-values.model";
import {WindowRefService} from "../../services/window-ref.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @Input() avatars: IAvatar[];
  legislationData: ILegislation[];
  filteredLegislationData: ILegislation[];
  autoCompleteOptions: ILegislation[];
  filteredAutoCompleteOptions: ILegislation[];
  paginatedLegislationData: ILegislation[];
  legislationVal: any;
  currentPage = 0;
  pageSize = 8;
  allKeys: (keyof ILegislation)[];
  searchByOptions: IOption[] = SearchBy;
  selectedSearchBy: IOption;
  placeholderForSearch: string;
  isSsr: boolean;

  constructor(private apiCallsService: ApiCallsService, private windowRefService: WindowRefService) {
  }

  ngOnInit(): void {
    this.getLegislationData();
  }

  ngAfterViewInit() {
  }

  searchByClicked(optionObj: any) {
    this.selectedSearchBy = optionObj.option;
    this.placeholderForSearch = this.selectedSearchBy.name;
   // this.filteredLegislationData = this.legislationData.
    const key = this.selectedSearchBy.code as keyof ILegislation;
    const uniqueOptions = [...new Set(this.legislationData.map(item => {
      return item[key];
    }))];
    this.autoCompleteOptions = uniqueOptions.filter(item => item).map(optionItem => {
      const newDropdownList = {} as ILegislation;
      newDropdownList[key] = optionItem;
      return newDropdownList;
    });
    this.filteredAutoCompleteOptions = this.autoCompleteOptions;
    this.reset();
    console.log('OPITONS', this.autoCompleteOptions);
  }

  async getLegislationData() {
    this.legislationData = await this.apiCallsService.getLegislation().toPromise();
    this.filteredLegislationData = [...this.legislationData];
    this.setPaginateData();
    this.setKeys();
  }

  setKeys() {
    this.allKeys = (Object.keys(this.legislationData[0]) as (keyof ILegislation)[]).filter(
      keyItem => keyItem !== 'Summary' && keyItem !== 'Title' && keyItem !== 'Links'
    );
  }

  filterAutoCompleteOptions(event: any) {
    let query = event.query;
    this.filteredAutoCompleteOptions = this.autoCompleteOptions.filter(legislation => {
      const key = this.selectedSearchBy.code as keyof ILegislation;
      return legislation[key].toLowerCase().indexOf(query.toLowerCase()) == 0;
    });
  }

  reset() {
    this.legislationVal = '';
    this.filteredLegislationData = [...this.legislationData];
    this.setPaginateData();
  }

  itemSelected(event: ILegislation){
    const key = this.selectedSearchBy.code as keyof ILegislation;
    const currentSearchByKeyVal = event[key];
    this.filterLegislation(currentSearchByKeyVal);
    this.setPaginateData();
  }

  filterLegislation(currentSearchByKeyVal: string) {
    this.filteredLegislationData = this.legislationData.filter(legislation => {
      const key = this.selectedSearchBy.code as keyof ILegislation;
      return legislation[key]?.toLowerCase()?.indexOf(currentSearchByKeyVal.toLowerCase()) == 0;
    });
    console.log('D', this.filteredLegislationData);
  }

  setPaginateData() {
    const startPoint = this.currentPage * this.pageSize;
    const endPoint = startPoint + this.pageSize;
    this.paginatedLegislationData = [...this.filteredLegislationData].slice(startPoint, endPoint);
  }

  paginate(event: any) {
    this.currentPage = event.page;
    this.setPaginateData();
  }

}
