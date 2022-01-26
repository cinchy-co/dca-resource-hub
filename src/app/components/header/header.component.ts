import {Component, Input, OnInit} from '@angular/core';
import {IAvatar} from "../../models/common.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() avatars: IAvatar[];

  constructor() {
  }

  ngOnInit() {
  }

}
