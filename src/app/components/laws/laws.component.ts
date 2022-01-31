import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ILegislation, IOption} from "../../models/common.model";
import {AppStateService} from "../../services/app-state.service";
import {ReplaySubject, takeUntil} from "rxjs";

@Component({
  selector: 'app-laws',
  templateUrl: './laws.component.html',
  styleUrls: ['./laws.component.scss']
})
export class LawsComponent implements OnInit, OnDestroy {
  @Input() legislationData: ILegislation[];
  @Input() selectedOption: IOption;
  filteredLegislationData: ILegislation[];
  paginatedLegislationData: ILegislation[];
  currentPage = 0;
  pageSize = 6;
  allKeys: (keyof ILegislation)[];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);


  constructor(private appStateService: AppStateService) {
  }

  ngOnInit(): void {
    this.filteredLegislationData = [...this.legislationData];
    this.setPaginateData();
    this.setKeys();
    this.subscribeToStateChanges();
  }

  subscribeToStateChanges() {
    this.appStateService.getSearchEnteredVal().pipe(takeUntil(this.destroyed$)).subscribe(searchVal => {
      this.filterLegislation(searchVal);
      this.setPaginateData();
    });

    this.appStateService.getDropdownOption().pipe(takeUntil(this.destroyed$)).subscribe(({dropdownStr, countrySelected}) => {
      this.filterLegislation(dropdownStr);
    });

    this.appStateService.getReset().pipe(takeUntil(this.destroyed$)).subscribe(isReset => {
      this.reset();
    });
  }

  setPaginateData() {
    const startPoint = this.currentPage * this.pageSize;
    const endPoint = startPoint + this.pageSize;
    this.paginatedLegislationData = [...this.filteredLegislationData].slice(startPoint, endPoint);
  }

  setKeys() {
    this.allKeys = (Object.keys(this.legislationData[0]) as (keyof ILegislation)[]).filter(
      keyItem => keyItem !== 'Summary' && keyItem !== 'Law' && keyItem !== 'Law Url'
    );
  }

  filterLegislation(currentSearchByKeyVal: string) {
    this.filteredLegislationData = this.legislationData.filter(legislation => {
      const key = this.selectedOption.code as keyof ILegislation;
      return legislation[key]?.toLowerCase()?.indexOf(currentSearchByKeyVal.toLowerCase()) == 0;
    });
    this.setPaginateData();
  }

  reset() {
    this.filteredLegislationData = [...this.legislationData];
    this.setPaginateData();
  }

  paginate(event: any) {
    this.currentPage = event.page;
    this.setPaginateData();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
