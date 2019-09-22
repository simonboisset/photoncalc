import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PropagationComponent } from './propagation/propagation.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { HomeComponent } from './home/home.component';
import { PulseComponent } from './pulse/pulse.component';
import { SpectrumComponent } from './spectrum/spectrum.component';
import { ModeComponent } from './mode/mode.component';
import { PowerComponent } from './power/power.component';
import { PositionComponent } from './position/position.component';
import { M2Component } from './m2/m2.component';
import { PageBodyComponent } from './page-body/page-body.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PropagationComponent,
    LineChartComponent,
    HomeComponent,
    PulseComponent,
    SpectrumComponent,
    ModeComponent,
    PowerComponent,
    PositionComponent,
    M2Component,
    PageBodyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
