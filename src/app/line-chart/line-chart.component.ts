import { AfterViewInit, Component, ViewChild, Input, ElementRef } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements AfterViewInit {

  @ViewChild('chart_div', { static: false }) pieChart: ElementRef;
  @Input() data: [];
  @Input() options: {};
  constructor() { }

  draw = () => {
    const data = google.visualization.arrayToDataTable(this.data);
    const chart = new google.visualization.LineChart(this.pieChart.nativeElement);
    chart.draw(data, this.options);
  }
  ngAfterViewInit() {
    google.charts.load('current', { 'packages': ['corechart', 'line'] });
    google.charts.setOnLoadCallback(this.draw);
  }
}

