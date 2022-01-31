import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ILegislation, IOption} from "../../models/common.model";
import {AppStateService} from "../../services/app-state.service";
import {ReplaySubject, takeUntil} from "rxjs";

@Component({
  selector: 'app-regulators',
  templateUrl: './regulators.component.html',
  styleUrls: ['./regulators.component.scss']
})
export class RegulatorsComponent implements OnInit, OnDestroy {
  @Input() regulatorData: any[];
  @Input() selectedOption: IOption;
  filteredRegulatorData: any[];
  paginatedRegulatorData: any;
  regulatorCurrentPage = 0;
  pageSize = 6;
  allKeys: any;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private appStateService: AppStateService) {
  }

  ngOnInit(): void {
    this.filteredRegulatorData = [...this.regulatorData];
    this.setRegulatorKeys();
    this.setRegulatorPaginateData();
    this.subscribeToStateChanges();
  }

  subscribeToStateChanges() {
    this.appStateService.getDropdownOption().pipe(takeUntil(this.destroyed$))
      .subscribe(({dropdownStr, countrySelected}) => {
      if (countrySelected) {
        this.filterRegulator(dropdownStr);
      }
    });
  }

  setRegulatorKeys() {
    this.allKeys = (Object.keys(this.regulatorData[0])).filter(
      keyItem => keyItem !== 'Entity Name' && keyItem !== 'Short Name' && keyItem !== 'Entity Url'
    );
  }

  filterRegulator(currentSearchByKeyVal: string) {
    this.filteredRegulatorData = this.regulatorData.filter((regulator: any) => {
      const key = this.selectedOption.code;
      return regulator[key]?.toLowerCase()?.indexOf(currentSearchByKeyVal.toLowerCase()) == 0;
    });
    this.setRegulatorPaginateData();
  }

  setRegulatorPaginateData() {
    const startPoint = this.regulatorCurrentPage * this.pageSize;
    const endPoint = startPoint + this.pageSize;
    this.paginatedRegulatorData = [...this.filteredRegulatorData].slice(startPoint, endPoint);
  }

  regulatorPaginate(event: any) {
    this.regulatorCurrentPage = event.page;
    this.setRegulatorPaginateData();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
