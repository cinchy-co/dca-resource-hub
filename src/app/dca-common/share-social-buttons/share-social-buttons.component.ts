import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-share-social-buttons',
  templateUrl: './share-social-buttons.component.html',
  styleUrls: ['./share-social-buttons.component.scss']
})
export class ShareSocialButtonsComponent implements OnInit {
  @Input() image: string;
  @Input() url: string;
  @Input() title: string;
  @Input() description: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  done() {
    console.log('DONE')
  }
}
