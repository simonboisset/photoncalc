import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-m2',
  templateUrl: './m2.component.html',
  styleUrls: ['./m2.component.scss']
})
export class M2Component implements OnInit {
  inputFile = [{
    label: "File",
    firstLine: 42,
    lastLine: 4,
    columns: ["Distance", 'X', 'Y'],
    transformData: this.transformData,
    makeOptions: this.makeOptions
  }]
  constructor() { }
  ngOnInit() { }
  transformData(row: string) {
    let newRow: any = row.split(",").map((text: string) => Number(text));
    return [newRow[1], newRow[2], newRow[3]];
  }
  makeOptions(data: [number[]], options: any) {
    // const Ymin = data.map((row) => row[1]).reduce((min, currentValue) => Math.min(min, currentValue), null)
    options.hAxis.viewWindow.min = data[0][0];
    options.hAxis.viewWindow.max = data[data.length - 1][0];
  }
}
