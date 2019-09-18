import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-propagation',
  templateUrl: './propagation.component.html',
  styleUrls: ['./propagation.component.scss']
})
export class PropagationComponent implements OnInit {

  opticalElementList = [];
  w0 = 6;
  wavelength = 1030;
  numberOfPoints = 100;
  options = {
    hAxis: {
      title: 'Distance (mm)'
    },
    vAxis: {
      title: 'Beam diameter (mm)'
    },
    width: 600,
    height: 400,
    legend:"none",
    chartArea: {right:10,top:10, width: '90%', height: '90%'},
  };
  constructor() { }
  ngOnInit(){}
  addElement(index: number) {
    this.opticalElementList.splice(index, 0, { label: "Label", value: 0, type: "distance", ableToModify: true });
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
  get data() {
    let data:any = [['Distance', 'Beam diameter']];
    let passageTotal = this.passageTotal();
    let distance = passageTotal.distance;
    let w0 = passageTotal.w0;
    let l = passageTotal.l;
    let Zr = passageTotal.Zr;
    if (distance > 0) {
      let z = 0;
      let y = 0;
      let interval = distance / this.numberOfPoints;
      let ii = 1;
      for (let i = 0; i < l.length; i++) {
        while (z <= l[i]) {
          y = w0[i].y * Math.sqrt(1 + Math.pow((z - w0[i].z) / Zr[i] / 1000, 2));
          data[ii] = [z, y];
          z = z + interval;
          ii++;
        }
      }

    }
    return data;
  }
}
