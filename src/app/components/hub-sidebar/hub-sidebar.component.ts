import {Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {animate, style, transition, trigger} from "@angular/animations";
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "../../services/window-ref.service";
import {ICommunityDetails} from "../../models/general-values.model";
import {AppStateService} from "../../services/app-state.service";
import {IFooter} from "../../models/common.model";
import {IconProp} from "@fortawesome/fontawesome-svg-core";


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
  isMobileOrTab: boolean;
  showMore: boolean;
  moreSectionOptions: ICommunityDetails[];
  mainSectionOptions: ICommunityDetails[];
  collaborationBtn: ICommunityDetails;

  @Output() toggleSidebarClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private windowRef: WindowRefService,
              @Inject(PLATFORM_ID) private platformId: any, private appStateService: AppStateService) {
  }

  ngOnInit(): void {
    this.sidebarOptions = this.appStateService.communityDetails;
    this.mainSectionOptions = this.sidebarOptions.filter(item => item.navigation === 'Main');
    this.moreSectionOptions = this.sidebarOptions.filter(item => item.navigation === 'More');
    this.collaborationBtn = this.sidebarOptions.find(item => item.id === 'collaboration') as ICommunityDetails;
    this.footerDetails = this.appStateService.footerDetails;
    if (isPlatformBrowser(this.platformId)) {
      const url = this.windowRef.nativeWindow.location.href;
      this.setCurrentOption(url);
      this.isMobileOrTab = this.windowRef.nativeWindow.innerWidth < 1040;
      this.isExpanded = !this.isMobileOrTab;
    }
    this.appStateService.getSidebarOption().subscribe(sidebarRoute => {
      this.setCurrentOption(sidebarRoute);
    })
  }

  setCurrentOption(routeOrUrl: string) {
    const currentOption = this.sidebarOptions.find(option => routeOrUrl.includes(option.sidebarRoute) && option.sidebarRoute !== '/');
    this.currentOptionSelected = currentOption ? currentOption : this.sidebarOptions[0];
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.toggleSidebarClicked.emit(this.isExpanded);
  }

  optionClicked(option: ICommunityDetails) {
    if (option.id === 'more') {
      this.showMore = !this.showMore;
    } else if (option.redirectLink) {
      if (isPlatformBrowser(this.platformId)) {
        const url = option.redirectLink;
        this.windowRef.nativeWindow.open(url, '_blank');
      }
    } else {
      this.currentOptionSelected = option;
      this.isExpanded = this.isMobileOrTab ? false : this.isExpanded;
      this.toggleSidebarClicked.emit(this.isExpanded);
      this.router.navigate([`${option.sidebarRoute}`]);
    }
  }

  getIcon(option: ICommunityDetails, isCollapsed?: boolean): IconProp {
    const iconToTake = isCollapsed ? option.collapseIcon : option.faIcon;
    return iconToTake.split(',') as IconProp;
  }

  goToHome() {
    this.router.navigate([`/`]);
  }

  goToCollabs() {
    const url = this.collaborationBtn.sidebarRoute;
    this.router.navigate([`${url}`]);
  }

}
