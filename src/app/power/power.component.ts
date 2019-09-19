import { Component, OnInit } from '@angular/core';
import { isString } from 'util';

@Component({
  selector: 'app-power',
  templateUrl: './power.component.html',
  styleUrls: ['./power.component.scss']
})
export class PowerComponent implements OnInit {

  start = 0;
  end = 1;
  data: any = [['Time', 'Power']];
  options = {
    hAxis: {
      title: 'Time (h)'
    },
    vAxis: {
      title: 'Power (W)'
    },
    width: 600,
    height: 400,
    legend: "none",
    chartArea: { right: 10, top: 10, width: '90%', height: '90%' },
  };
  constructor() { }
  ngOnInit() { }
  fileChange(file: File) {
    let reader = new FileReader();
    reader.onload = () => {
      if (isString(reader.result)) {
        let Ymax = 0, Ymin = null;
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
          if (newRow[1] > Ymax) {
            Ymax = newRow[1];
          }
          if (newRow[1] < Ymin || Ymin === null) {
            Ymin = newRow[1];
          }
          // if (isNaN(newRow[0]) || isNaN(newRow[1])) {
          //   console.log(index + "Parameter is not a number!");
          // }
          newRow[0] = newRow[0] / 3600;
          return newRow;
        });
        this.start = data[0][0];
        this.end = data[data.length - 1][0];
        data.splice(0, 0, ['Time', 'Power']);
        this.data = data;
      }

    }

    reader.readAsText(file);
  }
  rangeChange() {

  }
  // analyse = () =>{
  //   let data = this.state.data;
  //   if (data===null) {
  //     return {mean:0,rms:0};
  //   }
  //   else {
  //     // calcul moyenne
  //     let mean = 0;
  //     for (let i = 0; i < data.length; i++) {
  //       mean = mean + data[i].puissance;
  //     }
  //     mean = mean/data.length;
  //     // calcul écart-type
  //     let ecartType = 0;
  //     for (let i = 0; i < data.length; i++) {
  //       ecartType = ecartType + Math.pow(data[i].puissance - mean,2);
  //     }
  //     ecartType = Math.sqrt(ecartType/data.length);
  //     let rms = (ecartType/mean)*100;
  //     mean = Math.round(mean*100)/100;
  //     rms = Math.round(rms*100)/100;
  //     return {rms,mean};
  //   }
  // }
  // domain = () => {
  //   let domain = {};
  //   domain.x = [this.state.start,this.state.end];
  //   domain.y1 = [Math.round((this.state.Ymin-(this.state.Ymin/50))*100)/100,Math.round((this.state.Ymax+(this.state.Ymax/50))*100)/100];
  //   domain.y2 = [20,55];
  //   return domain;
  // }
}
