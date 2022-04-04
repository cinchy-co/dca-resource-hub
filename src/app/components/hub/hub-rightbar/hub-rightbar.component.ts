import {Component, Input, OnInit} from '@angular/core';
import {IUser} from "../../../models/common.model";

@Component({
  selector: 'app-hub-rightbar',
  templateUrl: './hub-rightbar.component.html',
  styleUrls: ['./hub-rightbar.component.scss']
})
export class HubRightbarComponent implements OnInit {
  @Input() userDetails: IUser;

  constructor() {
  }

  ngOnInit(): void {
    console.log('pppp USE DFERT', this.userDetails);
  }

}
