import {Component, Input, OnInit} from '@angular/core';
import {AppStateService} from "../../services/app-state.service";
import {IUser} from "../../models/common.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() userDetails: IUser;

  constructor( private appStateService: AppStateService) { }

  ngOnInit(): void {
    this.userDetails = this.userDetails ? this.userDetails : this.appStateService.userDetails;
  }

}
