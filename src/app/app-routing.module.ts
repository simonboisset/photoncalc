import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropagationComponent } from "./propagation/propagation.component";
import { HomeComponent } from "./home/home.component";
import { ModeComponent } from "./mode/mode.component";
import { PulseComponent } from "./pulse/pulse.component";
import { PositionComponent } from "./position/position.component";
import { PowerComponent } from "./power/power.component";
import { SpectrumComponent } from "./spectrum/spectrum.component";
import { M2Component } from "./m2/m2.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'propagation', component: PropagationComponent },
  { path: 'mode', component: ModeComponent },
  { path: 'm2', component: M2Component },
  { path: 'spectre', component: SpectrumComponent },
  { path: 'pulse', component: PulseComponent },
  { path: 'power', component: PowerComponent },
  { path: 'position', component: PositionComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
