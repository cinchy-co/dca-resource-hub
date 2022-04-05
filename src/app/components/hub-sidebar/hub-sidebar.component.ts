import {Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {animate, style, transition, trigger} from "@angular/animations";
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "../../services/window-ref.service";
import {ICommunityDetails} from "../../models/general-values.model";
import {AppStateService} from "../../services/app-state.service";
import {IFooter} from "../../models/common.model";

@Component({
  selector: 'app-hub-sidebar',
  templateUrl: './hub-sidebar.component.html',
  styleUrls: ['./hub-sidebar.component.scss'],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(10px)'}),
        animate('500ms', style({opacity: 1, transform: 'translateY(0)'})),
      ]),
      transition(':leave', [
        animate('10ms', style({opacity: 0, transform: 'translateY(10px)'})),
      ]),
    ]),
  ]
})
export class HubSidebarComponent implements OnInit {
  isExpanded = true;
  sidebarOptions: ICommunityDetails[];
  currentOptionSelected: ICommunityDetails;
  footerDetails: IFooter[];
  @Output() toggleSidebarClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private windowRef: WindowRefService,
              @Inject(PLATFORM_ID) private platformId: any, private appStateService :AppStateService) {
  }

  ngOnInit(): void {
    this.sidebarOptions = this.appStateService.communityDetails;
    this.footerDetails = this.appStateService.footerDetails;
    if(isPlatformBrowser(this.platformId)) {
      const url = this.windowRef.nativeWindow.location.href;
      const currentOption = this.sidebarOptions.find(option => url.includes(option.sidebarRoute) && option.sidebarRoute !== '/');
      this.currentOptionSelected = currentOption ? currentOption : this.sidebarOptions[0];
    }
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.toggleSidebarClicked.emit(this.isExpanded);
  }

  goToAnotherPage(option: ICommunityDetails) {
    this.currentOptionSelected = option;
    this.router.navigate([`${option.sidebarRoute}`]);

  }

}
