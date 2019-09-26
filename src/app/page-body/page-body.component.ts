import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { isString } from 'util';
@Component({
  selector: 'app-page-body',
  templateUrl: './page-body.component.html',
  styleUrls: ['./page-body.component.scss']
})
export class PageBodyComponent implements OnInit {
  @Input() inputFile: [{ columns: string[], transformData: Function, makeOptions: Function, label: string, firstLine: number, lastLine: number }];
  @Input() title: string;
  @Input() options : google.visualization.LineChartOptions
  data: any = [['Time', 'Power']];
  constructor() { }
  ngOnInit() { 
    if (DataService.data[this.title]) {
      this.data = DataService.data[this.title].data;
      this.options = DataService.data[this.title].options;
    }
    else{
      DataService.data[this.title] = {
        data : this.data,
        options : this.options
      }
    }
  }
  onFileChange(file: File, i: number) {
    let reader: any = new FileReader();
    reader.onload = () => {
      if (isString(reader.result)) {
        let data: any = reader.result.split('\n');
        data.splice(0, this.inputFile[i].firstLine);
        data.splice(data.length - this.inputFile[i].lastLine, this.inputFile[i].lastLine);
        data = this.inputFile[i].transformData(data,this.options);
        data.splice(0, 0, this.inputFile[i].columns);
        DataService.data[this.title].data = data;
        this.data = data;
      }
    }
    reader.readAsText(file);
  }
}
