import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PerformanceColisComponent } from './performance-colis/performance-colis.component';
import { SavebagComponent } from './savebag/savebag.component';
import { FormperformanceComponent } from './formperformance/formperformance.component';

const routes: Routes = [
  {
    path:'login',component:LoginComponent
  },{
    path:'dashboard',component:DashboardComponent,
  },{
    path:'performance',component:PerformanceColisComponent
  },{
    path:'form',component:FormperformanceComponent
  },{
    path:'SAVEBAG',component:SavebagComponent
  },{path:'' ,redirectTo:'login',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
