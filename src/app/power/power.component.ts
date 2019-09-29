import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DataService } from '../data.service';
@Component({
  selector: 'app-power',
  templateUrl: './power.component.html',
  styleUrls: ['./power.component.scss']
})
export class PowerComponent implements OnInit {
  data: any[]=[];
  inputFile = [{
    label: "Power",
    firstLine: 17,
    lastLine: 1
  }, {
    label: "Temp",
    firstLine: 1,
    lastLine: 0
  }]
  options: google.visualization.LineChartOptions = {
    hAxis: {
      title: 'Time (h)',
      viewWindow: { min: 0, max: 0 },
    },
    vAxis: {
      title: 'Power (W)',
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
    if (DataService.data["Power"]) {
      this.data = DataService.data["Power"].data;
      this.options = DataService.data["Power"].options;
    }
    else {
      DataService.data["Power"] = {
        data: this.data,
        options: this.options
      }
    }
  }
  onChange($event: { data: [], index: number }) {
    switch ($event.index) {
      case 0: this.transformDataPower($event.data);
        break;
      case 1: this.transformDataTemp($event.data);
        break;
    }
  }
  transformDataPower(data: string[]) {
    let res = data.map((row: string) => {
      let newRow: any;
      newRow = row
      while (newRow[0] === " ") {
        newRow = newRow.slice(1);
      }
      newRow = newRow.slice(0, -3);
      newRow = newRow.split("	  ");
      newRow = newRow.map((text: string) => Number(text));
      newRow[0] = newRow[0] / 3600;
      return newRow;
    })
    this.options.hAxis.viewWindow.min = res[0][0];
    this.options.hAxis.viewWindow.max = Math.round((res[res.length - 1][0]) * 10) / 10 - 5;

    // calcul moyenne
    let mean = 0;
    for (let i = 0; i < res.length; i++) {
      mean = mean + res[i][1];
    }
    mean = mean / res.length;
    // calcul écart-type
    let ecartType = 0;
    for (let i = 0; i < res.length; i++) {
      ecartType = ecartType + Math.pow(res[i][1] - mean, 2);
    }
    ecartType = Math.sqrt(ecartType / res.length);
    let rms = (ecartType / mean) * 100;
    mean = Math.round(mean * 100) / 100;
    rms = Math.round(rms * 100) / 100;
    this.options.title = `Mean: ${mean}W RMS: ${rms}%`;
    res.splice(0, 0, ['Time', 'Power']);
    DataService.data["Power"].data = res;
    this.data = res;
  }
  transformDataTemp(data: string[]) {
    let t0: moment.Moment;
    let res = data.map((row: string) => {
      let newRow: any = row.slice(0, -2);
      newRow = row.split(",");
      newRow[1] = moment(newRow[1], "DD-MM-YYYY HH:mm:ss");
      if (!t0) {
        newRow[0] = 0
        t0 = newRow[1];
      }
      else {
        newRow[0] = moment.duration(newRow[1].diff(t0)).as("second");
      }
      newRow = newRow.map((text: string) => Number(text));
      return [newRow[0], newRow[2], newRow[3]];
    })
    let ii = 0;
    this.options.vAxes = {
      0: { logScale: false },
      1: { textPosition: "none" ,title:""},
      2: { textPosition: "none" ,title:""}
    },
      this.options.series = {
        0: { targetAxisIndex: 0 },
        1: { targetAxisIndex: 1 },
        2: { targetAxisIndex: 2 }
      }
    res = this.data.map((row: any[],index) => {
      if (index===0) {
        return ['Time', 'Power', 'Temperature', 'Humidity'];
      }
      if (res[ii][0] / 3600 < row[0] && res[ii + 1][0] >= row[0]) {
        ii++
      }
      return [row[0], row[1], res[ii][1], res[ii][2]]
    });
    DataService.data["Power"].data = res;
    this.data = res;
  }
}
