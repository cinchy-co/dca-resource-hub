import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ApiCallsService} from "../../services/api-calls.service";
import {IAvatar, IDropdownClick, ILegislation, IOption} from "../../models/common.model";
import {SearchBy} from "../../models/general-values.model";
import {AppStateService} from "../../services/app-state.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    @Input() avatars: IAvatar[];
    legislationData: ILegislation[];
    allRegulatorKeys: any[];
    searchByOptions: IOption[] = SearchBy;
    podcastsData: any;
    regulatorData: any;
    newsFeedData: any;
    searchVal: any; //
    selectedOption: IOption; //
    dropdownOptionStr: string; //
    countrySelected: string;//

    constructor(private apiCallsService: ApiCallsService, private appStateService: AppStateService) {
    }

    ngOnInit(): void {
        this.getLegislationData();
        this.getRegulatorData();
        this.getNewsFeed();
        this.getPodcasts();
    }

    async getLegislationData() {
        this.legislationData = await this.apiCallsService.getLegislation().toPromise();
    }

    async getRegulatorData() {
        this.regulatorData = await this.apiCallsService.getPrivacyRegulators().toPromise();
    }

    async getNewsFeed() {
        this.newsFeedData = await this.apiCallsService.getPrivacyNewsFeed().toPromise();
    }

    async getPodcasts() {
        this.podcastsData = await this.apiCallsService.getPrivacyPodcasts().toPromise();
    }

    searchBySelected(option: IOption) {
        this.selectedOption = option;
    }

    itemSelectedInDropdown(data: IDropdownClick) {
        this.searchVal = data.dropdownStr;
        this.dropdownOptionStr = data.dropdownStr;
        this.countrySelected = data.countrySelected;
        this.appStateService.setDropdownOption(data);
    }

    itemSearched(val: string) {
        this.searchVal = val;
        this.appStateService.setSearch(val);
    }

    reset() {
        this.searchVal = '';
        this.appStateService.setReset(true);
    }

}
