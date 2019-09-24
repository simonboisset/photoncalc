import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    if (localStorage.getItem("data")) {
      DataService.data = JSON.parse(localStorage.getItem("data"));
    }
    else{
      this.exemple();
    }
  }
  exemple() { 
    DataService.data = Object.assign(DataService.exemple);
  }
  import() { }
  export() {
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(DataService.data));
    var a = document.createElement('a');
    a.href = 'data:' + data;
    a.download = 'data.json';
    a.innerHTML = 'download JSON';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  save() {
    localStorage.setItem("data", JSON.stringify(DataService.data));
  }
}
