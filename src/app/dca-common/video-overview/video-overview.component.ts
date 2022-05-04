import {Component, Input, OnInit} from '@angular/core';
import {ITools} from "../../components/hub/model/hub.model";

@Component({
  selector: 'app-video-overview',
  templateUrl: './video-overview.component.html',
  styleUrls: ['./video-overview.component.scss']
})
export class VideoOverviewComponent implements OnInit {
  @Input() toolDetails: ITools;

  constructor() {
  }

  ngOnInit(): void {
  }

}
