import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  static propagation: any = {
    opticalElementList: [{ label: "Label", value: 50, type: "distance", ableToModify: false },
    { label: "Label", value: 50, type: "lens", ableToModify: false },
    { label: "Label", value: 100, type: "distance", ableToModify: false }]
  };

  constructor() { }
}
