import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../data.service';
import { isString } from 'util';
@Component({
  selector: 'app-page-body',
  templateUrl: './page-body.component.html',
  styleUrls: ['./page-body.component.scss']
})
export class PageBodyComponent {
  @Input() inputFile: [{ columns: string[], transformData: Function, makeOptions: Function, label: string, firstLine: number, lastLine: number }];
  @Input() title: string;
  @Input() data: any[];
  @Input() options : google.visualization.LineChartOptions
  @Output() change = new EventEmitter();
  constructor() { }
  onFileChange(file: File, i: number) {
    let reader: any = new FileReader();
    reader.onload = () => {
      if (isString(reader.result)) {
        let data: any = reader.result.split('\n');
        data.splice(0, this.inputFile[i].firstLine);
        data.splice(data.length - this.inputFile[i].lastLine, this.inputFile[i].lastLine);
        this.change.emit({data,index:i});
      }
    }
    reader.readAsText(file);
  }
}
