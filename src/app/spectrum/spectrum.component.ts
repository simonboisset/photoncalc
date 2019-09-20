import { Component, OnInit } from '@angular/core';
import { isString } from 'util';

@Component({
  selector: 'app-spectrum',
  templateUrl: './spectrum.component.html',
  styleUrls: ['./spectrum.component.scss']
})
export class SpectrumComponent implements OnInit {

  start = 0;
  end = 1;
  rms = 0;
  mean = 0;
  data: any = [['Time', 'Power']];
  options = {
    hAxis: {
      title: 'Time (h)',
      viewWindow: { min: 0, max: 0 },
    },
    vAxis: {
      title: 'Power (W)',
    },
    title: "Moyenn: W RMS: %",
    titlePosition: "in",
    width: 600,
    height: 400,
    legend: { position: "in" },
    chartArea: { right: 10, top: 10, width: '90%', height: '80%' },
  };
  constructor() { }
  ngOnInit() { }
  fileChange(file: File) {
    let reader = new FileReader();
    reader.onload = () => {
      if (isString(reader.result)) {
        let data: any = reader.result.split('\n');
        data.splice(0, 17);
        data.splice(data.length - 1, 1);
        data = data.map((row: string) => {
          let newRow: any;
          newRow = row
          while (newRow[0] === " ") {
            newRow = newRow.slice(1);
          }
          newRow = newRow.slice(0, -3);
          newRow = newRow.split("	  ");
          // newRow = Number(newRow);
          newRow = newRow.map((text: string) => Number(text));
          newRow[0] = newRow[0] / 3600;
          return newRow;
        });
        this.options.hAxis.viewWindow.min = data[0][0];
        this.options.hAxis.viewWindow.max = Math.round((data[data.length - 1][0]) * 10) / 10 - 5;

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
        data.splice(0, 0, ['Time', 'Power']);
        this.data = data;
        this.options.title = `Mean: ${mean}W RMS: ${rms}%`;
      }
    }
    reader.readAsText(file);
  }
  
  rangeChange() {
    // this.data = this.data;
  }
}
