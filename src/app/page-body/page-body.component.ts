import { Component, OnInit, Input } from '@angular/core';
import { isString } from 'util';
@Component({
  selector: 'app-page-body',
  templateUrl: './page-body.component.html',
  styleUrls: ['./page-body.component.scss']
})
export class PageBodyComponent implements OnInit {
  @Input() inputFile: [{ columns: string[], transformData: Function, makeOptions: Function, label: string, firstLine: number, lastLine: number }];
  @Input() title: string;

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
  onFileChange(file: File, i: number) {
    let reader: any = new FileReader();
    reader.onload = () => {
      if (isString(reader.result)) {
        let data: any = reader.result.split('\n');
        data.splice(0, this.inputFile[i].firstLine);
        data.splice(data.length - this.inputFile[i].lastLine, this.inputFile[i].lastLine);
        data = data.map((row: string) => this.inputFile[i].transformData(row));
        this.inputFile[i].makeOptions(data, this.options)
        data.splice(0, 0, this.inputFile[i].columns);
        this.data = data;
      }
    }
    reader.readAsText(file);
  }
}
