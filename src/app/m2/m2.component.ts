import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
@Component({
  selector: 'app-m2',
  templateUrl: './m2.component.html',
  styleUrls: ['./m2.component.scss']
})
export class M2Component implements OnInit {
  data: any[] = [];
  inputFile = [{
    label: "M2",
    firstLine: 42,
    lastLine: 4
  }]
  options: google.visualization.LineChartOptions = {
    hAxis: {
      title: 'Distance (mm)',
      viewWindow: { min: 0, max: 0 },
    },
    vAxis: {
      title: 'Intensity',
    },
    width: 600,
    height: 400,
    legend: { position: "top" },
    chartArea: { right: 10, top: 40, width: '90%', height: '80%' },
  };
  constructor() { }
  ngOnInit() {
    if (DataService.data["M2"]) {
      this.data = DataService.data["M2"].data;
      this.options = DataService.data["M2"].options;
    }
    else {
      DataService.data["M2"] = {
        data: this.data,
        options: this.options
      }
    }
  }
  transformData(input: { data: string[], index: number }) {
    let res = input.data.map((row: string) => {
      let newRow: any = row.split(",").map((text: string) => Number(text));
      return [newRow[1], newRow[2], newRow[3]];
    })
    this.options.hAxis.viewWindow.min = res[0][0];
    this.options.hAxis.viewWindow.max = res[res.length - 1][0];
    res.splice(0, 0, ["Distance", 'X', 'Y']);
    DataService.data["M2"].data = res;
    this.data = res;
  }
}
