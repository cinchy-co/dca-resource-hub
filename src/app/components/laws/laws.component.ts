import {Component, Input, OnInit} from '@angular/core';
import {ILegislation} from "../../models/common.model";

@Component({
  selector: 'app-laws',
  templateUrl: './laws.component.html',
  styleUrls: ['./laws.component.scss']
})
export class LawsComponent implements OnInit {
@Input() legislationData: ILegislation[];
@Input() allKeys: (keyof ILegislation)[];
  constructor() { }

  ngOnInit(): void {
  }

}
