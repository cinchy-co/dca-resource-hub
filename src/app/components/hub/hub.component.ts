import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss']
})
export class HubComponent implements OnInit {
  isSidebarExpanded: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

  sidebarStateChange(isExpanded: boolean) {
    this.isSidebarExpanded = isExpanded;
  }

}
