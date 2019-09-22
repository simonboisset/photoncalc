import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-pulse',
  templateUrl: './pulse.component.html',
  styleUrls: ['./pulse.component.scss']
})
export class PulseComponent implements OnInit {
  inputFile = [{
    label: "File",
    firstLine: 15,
    lastLine: 1,
    columns: ['Time', 'Intensity'],
    transformData: this.transformData,
    makeOptions: this.makeOptions
  }]
  constructor() { }
  ngOnInit() { }
  transformData(row: string) {
    const newRow: any = row.split(/\s+/).map((text: string) => Number(text));
    return [newRow[1], newRow[2]];
  }
  makeOptions(data: [number[]], options: any) {
    const Ymax = data.map((row)=>row[1]).reduce((max,currentValue)=>Math.max(max,currentValue),0)
    const X_FWHM_min = data.find((row: number[]) => row[1] >= Ymax / 2)[0];
    const X_FWHM_max = data.reverse().find((row: number[]) => row[1] >= Ymax / 2)[0];
    let deltaWL = Math.round((X_FWHM_max - X_FWHM_min) * 1000);
    options.title = `Pulse duration: ${deltaWL}fs`;
    options.hAxis.viewWindow.min = data[0][0];
    options.hAxis.viewWindow.max = Math.round((data[data.length - 1][0]) * 10) / 10;
  }
}
