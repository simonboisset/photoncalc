import { Component, OnInit } from '@angular/core';
import { isString } from 'util';

@Component({
  selector: 'app-pulse',
  templateUrl: './pulse.component.html',
  styleUrls: ['./pulse.component.scss']
})
export class PulseComponent implements OnInit {
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
        let data: any = reader.result.split('\n');
        data.splice(0, 15);
        data.splice(data.length - 1, 1);
        data = data.map((row: string) => {
          let newRow: any = row.split(/\s+/).map((text: string) => Number(text));
          return [newRow[1],newRow[2]];
        });
        this.options.hAxis.viewWindow.min = data[0][0];
        this.options.hAxis.viewWindow.max = Math.round((data[data.length - 1][0]) * 10) / 10;


        data.splice(0, 0, ['Time', 'Intensity']);
        this.data = data;
        // this.options.title = `Mean: ${mean}W RMS: ${rms}%`;
      }
    }
    reader.readAsText(file);
  }

  rangeChange() {
    // this.data = this.data;
  }
}
