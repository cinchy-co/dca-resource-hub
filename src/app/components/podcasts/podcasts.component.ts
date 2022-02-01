import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-podcasts',
  templateUrl: './podcasts.component.html',
  styleUrls: ['./podcasts.component.scss']
})
export class PodcastsComponent implements OnInit {
  @Input() podcasts: any;
  paginatedPodcastsData: any;
  currentPage = 0;
  pageSize = 8;
  constructor() { }

  ngOnInit(): void {
    this.setPaginateData();
  }


  paginate(event: any) {
    this.currentPage = event.page;
    this.setPaginateData();
  }

  setPaginateData() {
    const startPoint = this.currentPage * this.pageSize;
    const endPoint = startPoint + this.pageSize;
    this.paginatedPodcastsData = [...this.podcasts].slice(startPoint, endPoint);
  }

}
