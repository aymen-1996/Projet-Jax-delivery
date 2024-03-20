import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/Login/login.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { CreatOffreComponent } from './Components/creat-offre/creat-offre.component';
import { SaveAllComponent } from './Components/save-all/save-all.component';
import { ConstOffreComponent } from './Components/const-offre/const-offre.component';
import { ResetPasswordComponent } from './Components/Reset-password/reset-password.component';
import { ListvalidComponent } from './Components/listvalid/listvalid.component';
import { AdminComponent } from './Components/admin/admin.component';
import { AllUsersComponent } from './Components/all-users/all-users.component';

const routes: Routes = [

  { path: "login", component: LoginComponent },
  { path: 'Accueil', component: DashboardComponent  ,canActivate: [AuthGuard]},
  { path: 'creatOffre', component: CreatOffreComponent  ,canActivate: [AuthGuard]},
  { path: 'OffreValide', component: ListvalidComponent  ,canActivate: [AuthGuard]},
  { path: 'importExcel', component: SaveAllComponent  ,canActivate: [AuthGuard]},
  {path:'adminListOffre',component:AdminComponent,canActivate: [AuthGuard]},
  { path: 'All', component: ConstOffreComponent  ,canActivate: [AuthGuard]},
  { path: 'resetPassword', component: ResetPasswordComponent},
  { path: 'listUser', component: AllUsersComponent,canActivate: [AuthGuard]},


  { path: '**', redirectTo: '/login' },




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
