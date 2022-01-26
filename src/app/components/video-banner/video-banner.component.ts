import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as Plyr from 'plyr';

@Component({
  selector: 'app-video-banner',
  templateUrl: './video-banner.component.html',
  styleUrls: ['./video-banner.component.scss']
})
export class VideoBannerComponent implements OnInit, AfterViewInit {
  youtubeSources: Plyr.Source[] = [
    {
      src: 'https://youtube.com/watch?v=bTqVqk7FSmY',
      provider: 'youtube',
    },
  ];
  isLoaded: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
   // const FaIconComponent = (await import('@fortawesome/angular-fontawesome')).FaIconComponent

  }

}
