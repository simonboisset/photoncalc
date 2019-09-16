import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {PropagationComponent} from "./propagation/propagation.component"
const routes: Routes = [
  { path: '', component: PropagationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
