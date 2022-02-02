import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentUrl: string;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUrl = window.location.href;
    }
  }

}
