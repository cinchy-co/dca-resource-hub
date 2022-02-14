import {Component, Input, OnInit} from '@angular/core';
import {IAvatar} from "../../models/common.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() avatars: IAvatar[];

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  goToHome() {
    this.router.navigate(['/']);
  }

}
