import {Component, Input, OnInit} from '@angular/core';
import {ILegislation} from "../../models/common.model";

@Component({
  selector: 'app-regulators',
  templateUrl: './regulators.component.html',
  styleUrls: ['./regulators.component.scss']
})
export class RegulatorsComponent implements OnInit {
  @Input() regulatorData: any[];
  @Input() allKeys: any[];

  constructor() { }

  ngOnInit(): void {
  }

}
