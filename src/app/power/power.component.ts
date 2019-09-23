import { Component, OnInit } from '@angular/core';
import { isString } from 'util';
import * as moment from 'moment';
@Component({
  selector: 'app-power',
  templateUrl: './power.component.html',
  styleUrls: ['./power.component.scss']
})
export class PowerComponent implements OnInit {
  t0: moment.Moment;
  inputFile = [{
    label: "Power",
    firstLine: 17,
    lastLine: 1,
    columns: ['Time', 'Power'],
    transformData: this.transformDataPower,
    makeOptions: this.makeOptionsPower
  }, {
    label: "Temp",
    firstLine: 1,
    lastLine: 0,
    columns: ['Time', 'Power', 'Temperature', 'Humidity'],
    transformData: this.transformDataTemp,
    makeOptions: this.makeOptionsTemp
  }]
  constructor() { }
  ngOnInit() { }
  transformDataPower(row: string) {
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
  }
  makeOptionsPower(data: [number[]], options: any) {
    options.hAxis.viewWindow.min = data[0][0];
    options.hAxis.viewWindow.max = Math.round((data[data.length - 1][0]) * 10) / 10 - 5;

    // calcul moyenne
    let mean = 0;
    for (let i = 0; i < data.length; i++) {
      mean = mean + data[i][1];
    }
    mean = mean / data.length;
    // calcul écart-type
    let ecartType = 0;
    for (let i = 0; i < data.length; i++) {
      ecartType = ecartType + Math.pow(data[i][1] - mean, 2);
    }
    ecartType = Math.sqrt(ecartType / data.length);
    let rms = (ecartType / mean) * 100;
    mean = Math.round(mean * 100) / 100;
    rms = Math.round(rms * 100) / 100;
    options.title = `Mean: ${mean}W RMS: ${rms}%`;
  }
  transformDataTemp(row: string) {
    let newRow: any = row.slice(0, -2);
    newRow = row.split(",");
    newRow[1] = moment(newRow[1], "DD-MM-YYYY HH:mm:ss");
    if (!this.t0) {
      newRow[0] = 0
      this.t0 = newRow[1];
    }
    else {
      newRow[0] = moment.duration(newRow[1].diff(this.t0)).as("second");
    }
    newRow = newRow.map((text: string) => Number(text));
    return [newRow[0], newRow[2], newRow[3]];
  }
  makeOptionsTemp(data: [number[]], options: any) {
    let ii = 0;
    return data.map((row: any[], i: number) => {
      if (i === 0) {
        return ['Time', 'Power', 'Temperature', 'Humidity']
      }
      else {
        if (data[ii][0] / 3600 < row[0] && data[ii + 1][0] >= row[0]) {
          ii++
        }
        return [row[0], row[1], data[ii][1], data[ii][2]]
      }
    });
  }
}
