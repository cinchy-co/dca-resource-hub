import {Component, OnInit} from '@angular/core';
import {AppStateService} from "../../services/app-state.service";

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss']
})
export class HubComponent implements OnInit {
  isSidebarExpanded: boolean;

  constructor(private appStateService: AppStateService) {
  }

  ngOnInit(): void {
  }

}
