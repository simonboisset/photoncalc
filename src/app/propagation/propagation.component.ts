import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-propagation',
  templateUrl: './propagation.component.html',
  styleUrls: ['./propagation.component.scss']
})
export class PropagationComponent implements OnInit {

  opticalElementList = [];
  w0=6;
  wavelength=1030;
  numberOfPoints=100;
  chart={
    type:"LineChart",
    title:"Chart",
    columnNames:["1"],
    data:[1,2,3,4]
  }
  constructor() { }

  addElement(index: number) {
    this.opticalElementList.splice(index, 0, { label: "Label", value: 0, type : "distance", ableToModify:true });
  }
  delElement(index: number) {
    this.opticalElementList.splice(index, 1);
  }
  passageTotal() {
    let distance = 0;
    let w0 = [{ z: 0, y: this.w0 }];
    let ii = 0;
    let l = [];
    let Zr = [];
    Zr[0] = Math.PI * Math.pow(w0[0].y / 1000, 2) / (this.wavelength / 1000000000);
    let li = 0;
    for (let i = 0; i < this.opticalElementList.length; i++) {
      if (this.opticalElementList[i].type === "distance") {
        distance = distance + this.opticalElementList[i].value;
        l[li] = distance;
        li++;
      } else {
        let z = distance - w0[ii].z;
        let w0_1 = w0[ii].y;
        let f = this.opticalElementList[i].value;
        let z_2 = f * (Math.pow(Zr[ii], 2) - z * (f - z) / 1000000) / (Math.pow(f - z, 2) / 1000000 + Math.pow(Zr[ii], 2));
        let w0_2 = w0_1 * Math.abs(f) / 1000 / Math.sqrt(Math.pow(f - z, 2) / 1000000 + Math.pow(Zr[ii], 2));
        let w0_i = { z: z_2 + distance, y: w0_2 };
        ii++;
        Zr[ii] = Math.PI * Math.pow(w0_2 / 1000, 2) / (this.wavelength / 1000000000);
        w0[ii] = w0_i;
      }
    }
    return { distance, w0, l, Zr };
  }
  propagationData() {
    let data = [];
    let passageTotal = this.passageTotal();
    let distance = passageTotal.distance;
    let w0 = passageTotal.w0;
    let l = passageTotal.l;
    let Zr = passageTotal.Zr;
    if (distance > 0) {
      let z = 0;
      let y = 0;
      let interval = distance / this.numberOfPoints;
      let ii = 0;
      for (let i = 0; i < l.length; i++) {
        while (z <= l[i]) {
          y = w0[i].y * Math.sqrt(1 + Math.pow((z - w0[i].z) / Zr[i] / 1000, 2));
          data[ii] = { distance: z, radius: y };
          z = z + interval;
          ii++;
        }
      }

    }
    return data;
  }
  drawBasic() {

    var data = new google.visualization.DataTable();
    data.addColumn('number', 'X');
    data.addColumn('number', 'Dogs');

    data.addRows([
      [0, 0],   [1, 10],  [2, 23],  [3, 17],  [4, 18],  [5, 9],
      [6, 11],  [7, 27],  [8, 33],  [9, 40],  [10, 32], [11, 35],
      [12, 30], [13, 40], [14, 42], [15, 47], [16, 44], [17, 48],
      [18, 52], [19, 54], [20, 42], [21, 55], [22, 56], [23, 57],
      [24, 60], [25, 50], [26, 52], [27, 51], [28, 49], [29, 53],
      [30, 55], [31, 60], [32, 61], [33, 59], [34, 62], [35, 65],
      [36, 62], [37, 58], [38, 55], [39, 61], [40, 64], [41, 65],
      [42, 63], [43, 66], [44, 67], [45, 69], [46, 69], [47, 70],
      [48, 72], [49, 68], [50, 66], [51, 65], [52, 67], [53, 70],
      [54, 71], [55, 72], [56, 73], [57, 75], [58, 70], [59, 68],
      [60, 64], [61, 60], [62, 65], [63, 67], [64, 68], [65, 69],
      [66, 70], [67, 72], [68, 75], [69, 80]
    ]);

    var options = {
      hAxis: {
        title: 'Time'
      },
      vAxis: {
        title: 'Popularity'
      }
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

    chart.draw(data, options);
  }
  ngOnInit() {
  }

}
