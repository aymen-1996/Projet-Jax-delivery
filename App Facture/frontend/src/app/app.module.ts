// angular import
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// project import
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './theme/shared/shared.module';
import { AdminComponent } from './theme/layouts/admin/admin.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { NavigationComponent } from './theme/layouts/admin/navigation/navigation.component';
import { NavBarComponent } from './theme/layouts/admin/nav-bar/nav-bar.component';
import { NavLeftComponent } from './theme/layouts/admin/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './theme/layouts/admin/nav-bar/nav-right/nav-right.component';
import { NavContentComponent } from './theme/layouts/admin/navigation/nav-content/nav-content.component';
import { NavCollapseComponent } from './theme/layouts/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './theme/layouts/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './theme/layouts/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavigationItem } from './theme/layouts/admin/navigation/navigation';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

// Import LoginModule
import { LoginComponent } from './demo/authentication/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { RepertoireComponent } from './demo/repertoire/repertoire.component';
import { FactureComponent } from './demo/facture/facture.component';

@NgModule({
  declarations: [
    RepertoireComponent,
    FactureComponent,
    AppComponent,
    AdminComponent,
    GuestComponent,
    NavigationComponent,
    NavBarComponent,
    NavLeftComponent,
    NavRightComponent,
    NavContentComponent,
    NavCollapseComponent,
    NavGroupComponent,
    NavItemComponent,
    LoginComponent,
    


  ],
  imports: [RouterModule,
    HttpClientModule,
    BrowserModule, 
    AppRoutingModule,
    SharedModule,
     BrowserAnimationsModule], // Include LoginModule here
  providers: [NavigationItem,CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {}
