import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HubSidebarOptions, IHubSidebarItems} from "../model/hub.model";
import {ActivatedRoute, Router} from '@angular/router'
import {animate, style, transition, trigger} from "@angular/animations";

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
  isExpanded: boolean;
  sidebarOptions: IHubSidebarItems[] = HubSidebarOptions;
  currentOptionSelected: IHubSidebarItems = HubSidebarOptions[0];
  @Output() toggleSidebarClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.toggleSidebarClicked.emit(this.isExpanded);
  }

  goToAnotherPage(option: IHubSidebarItems) {
    this.currentOptionSelected = option;
    this.router.navigate([`hub/${option.route}`]);

  }

}
