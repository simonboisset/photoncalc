import { Component, OnInit } from '@angular/core';
import { isString } from 'util';
@Component({
  selector: 'app-m2',
  templateUrl: './m2.component.html',
  styleUrls: ['./m2.component.scss']
})
export class M2Component implements OnInit {

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
        let Ymin =null;
        let data: any = reader.result.split('\n');
        data.splice(0, 42);
        data.splice(data.length - 4, 4);
        data = data.map((row: string) => {
          let newRow: any = row.split(",");
          newRow = newRow.map((text: string) => Number(text));
          Ymin = Math.min(Ymin, newRow[2],newRow[3])
          return [newRow[1],newRow[2],newRow[3]];
        });
        
        this.options.hAxis.viewWindow.min = data[0][0];
        this.options.hAxis.viewWindow.max = data[data.length-1][0];
        data.splice(0, 0, ["Distance", 'X','Y']);
        this.data = data;
      }
    }
    reader.readAsText(file);
  }

  rangeChange() {
    // this.data = this.data;
  }

}
