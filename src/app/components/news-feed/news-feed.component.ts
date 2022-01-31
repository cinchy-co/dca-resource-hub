import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss']
})
export class NewsFeedComponent implements OnInit {
  @Input() newsFeed: any;

  constructor() { }

  ngOnInit(): void {
    console.log('NEWS FEED', this.newsFeed)
  }

}
