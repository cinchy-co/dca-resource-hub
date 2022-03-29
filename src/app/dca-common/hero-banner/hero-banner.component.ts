import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IWebsiteDetails} from "../../models/common.model";

@Component({
  selector: 'app-hero-banner',
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.scss']
})
export class HeroBannerComponent implements OnInit {
  @Input() webSiteDetails: IWebsiteDetails;
  @Output() sidebarToggled: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  toggleSidebar() {
    this.sidebarToggled.emit();
  }

}
