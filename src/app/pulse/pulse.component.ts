import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
@Component({
  selector: 'app-pulse',
  templateUrl: './pulse.component.html',
  styleUrls: ['./pulse.component.scss']
})
export class PulseComponent implements OnInit {
  data: any[] = [];
  inputFile = [{
    label: "Pulse",
    firstLine: 15,
    lastLine: 1
  }]
  options: google.visualization.LineChartOptions = {
    hAxis: {
      title: 'Delay (fs)',
      viewWindow: { min: 0, max: 0 },
    },
    vAxis: {
      title: 'Intensity',
    },
    title: "Moyenn: W RMS: %",
    titlePosition: "top",
    width: 600,
    height: 400,
    legend: { position: "top" },
    chartArea: { right: 10, top: 40, width: '90%', height: '80%' },
  };
  constructor() { }
  ngOnInit() {
    if (DataService.data["Pulse"]) {
      this.data = DataService.data["Pulse"].data;
      this.options = DataService.data["Pulse"].options;
    }
    else {
      DataService.data["Pulse"] = {
        data: this.data,
        options: this.options
      }
    }
  }
  transformData(input: { data: string[], index: number }) {
    let res = input.data.map((row: string) => {
      const newRow: any = row.split(/\s+/).map((text: string) => Number(text));
      return [newRow[1], newRow[2]];
    })
    const Ymax = res.map((row) => row[1]).reduce((max, currentValue) => Math.max(max, currentValue), 0)
    const X_FWHM_min = res.find((row: number[]) => row[1] >= Ymax / 2)[0];
    const X_FWHM_max = res.reverse().find((row: number[]) => row[1] >= Ymax / 2)[0];
    let deltaWL = Math.round((X_FWHM_max - X_FWHM_min) * 1000);
    this.options.title = `Pulse duration: ${deltaWL}fs`;
    this.options.hAxis.viewWindow.min = res[0][0];
    this.options.hAxis.viewWindow.max = Math.round((res[res.length - 1][0]) * 10) / 10;
    res.splice(0, 0, ['Time', 'Intensity']);
    DataService.data["Pulse"].data = res;
    this.data = res;
  }
}
