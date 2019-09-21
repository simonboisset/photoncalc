import { Component, OnInit } from '@angular/core';
import { isString, log } from 'util';

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
    let reader: any = new FileReader();
    reader.onload = () => {
      if (isString(reader.result)) {
        let Ymax =0;
        let data: any = reader.result.split('\n');
        data.splice(0, 17);
        data.splice(data.length - 1, 1);
        data = data.map((row: string) => {
          let newRow: any = row.split(";");
          newRow = newRow.map((text: string) => Number(text.replace(',', '.')));
          Ymax = Math.max(Ymax, newRow[1])
          return newRow;
        });
        
        const X_FWHM_min = data.find((row:number[])=> row[1]>=Ymax/2)[0];
        const X_FWHM_max = data.reverse().find((row:number[])=> row[1]>=Ymax/2)[0];
        let deltaWL = X_FWHM_max - X_FWHM_min;
        let centralWL = (X_FWHM_max + X_FWHM_min) / 2;
        centralWL = Math.round(centralWL * 100) / 100;
        deltaWL = Math.round(deltaWL * 100) / 100;
        data.splice(0, 0, ["Longueur d'onde", 'Intensity']);
        this.options.title = `Longueur d'onde: ${centralWL}nm Largeur: ${deltaWL}nm`;
        this.options.hAxis.viewWindow.min = Math.round((centralWL-deltaWL*2)/5)*5;
        this.options.hAxis.viewWindow.max = Math.round((centralWL+deltaWL*2)/5)*5;
        this.data = data;
      }
    }
    reader.readAsText(file);
  }

  rangeChange() {
    // this.data = this.data;
  }
}
