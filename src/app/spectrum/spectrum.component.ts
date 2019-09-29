import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
@Component({
  selector: 'app-spectrum',
  templateUrl: './spectrum.component.html',
  styleUrls: ['./spectrum.component.scss']
})
export class SpectrumComponent implements OnInit {
  data: any[] = [];
  inputFile = [{
    label: "Spectrum",
    firstLine: 17,
    lastLine: 1
  }]
  options: google.visualization.LineChartOptions = {
    hAxis: {
      title: 'Wavelength (nm)',
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
    if (DataService.data["Spectrum"]) {
      this.data = DataService.data["Spectrum"].data;
      this.options = DataService.data["Spectrum"].options;
    }
    else {
      DataService.data["Spectrum"] = {
        data: this.data,
        options: this.options
      }
    }
  }
  transformData(input: {data:string[],index:number}) {
    let res = input.data.map((row: string) => {
      let newRow: any = row.split(";");
      newRow = newRow.map((text: string) => Number(text.replace(',', '.')));
      return newRow;
    })
    const Ymax = res.map((row) => row[1]).reduce((max, currentValue) => Math.max(max, currentValue), 0)
    const X_FWHM_min = res.find((row: number[]) => row[1] >= Ymax / 2)[0];
    const X_FWHM_max = res.reverse().find((row: number[]) => row[1] >= Ymax / 2)[0];
    let deltaWL = X_FWHM_max - X_FWHM_min;
    let centralWL = (X_FWHM_max + X_FWHM_min) / 2;
    centralWL = Math.round(centralWL * 100) / 100;
    deltaWL = Math.round(deltaWL * 100) / 100;
    this.options.title = `Longueur d'onde: ${centralWL}nm Largeur: ${deltaWL}nm`;
    this.options.hAxis.viewWindow.min = Math.round((centralWL - deltaWL * 2) / 5) * 5;
    this.options.hAxis.viewWindow.max = Math.round((centralWL + deltaWL * 2) / 5) * 5;
    res.splice(0, 0, ["Longueur d'onde", 'Intensity']);
    DataService.data["Spectrum"].data = res;
    this.data = res;
  }
}
