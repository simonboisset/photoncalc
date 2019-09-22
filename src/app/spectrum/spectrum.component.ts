import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spectrum',
  templateUrl: './spectrum.component.html',
  styleUrls: ['./spectrum.component.scss']
})
export class SpectrumComponent implements OnInit {
  inputFile = [{
    label: "File",
    firstLine: 17,
    lastLine: 1,
    columns:["Longueur d'onde", 'Intensity'],
    transformData: this.transformData,
    makeOptions: this.makeOptions
  }]
  constructor() { }
  ngOnInit() { }
  transformData(row: string) {
    let newRow: any = row.split(";");
    newRow = newRow.map((text: string) => Number(text.replace(',', '.')));
    return newRow;
  }
  makeOptions(data: [number[]],options:any) {
    const Ymax = data.map((row)=>row[1]).reduce((max,currentValue)=>Math.max(max,currentValue),0)
    const X_FWHM_min = data.find((row: number[]) => row[1] >= Ymax / 2)[0];
    const X_FWHM_max = data.reverse().find((row: number[]) => row[1] >= Ymax / 2)[0];
    let deltaWL = X_FWHM_max - X_FWHM_min;
    let centralWL = (X_FWHM_max + X_FWHM_min) / 2;
    centralWL = Math.round(centralWL * 100) / 100;
    deltaWL = Math.round(deltaWL * 100) / 100;
    options.title = `Longueur d'onde: ${centralWL}nm Largeur: ${deltaWL}nm`;
    options.hAxis.viewWindow.min = Math.round((centralWL - deltaWL * 2) / 5) * 5;
    options.hAxis.viewWindow.max = Math.round((centralWL + deltaWL * 2) / 5) * 5;
  }
}
