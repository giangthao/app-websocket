import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { WebSocketService } from './services/websocket.service';
import { FormsModule, ReactiveFormsModule  }   from '@angular/forms';
import { TopBarComponent } from './layouts/default-layout/top-bar/top-bar.component';
import { SideBarComponent } from './layouts/default-layout/side-bar/side-bar.component';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { OverviewComponent } from './components/overview/overview.component';
import { LeaManagementComponent } from './components/lea-management/lea-management.component';
import { AddLeaComponent } from './components/lea-management/add-lea/add-lea.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { BreadcrumbComponent } from './layouts/default-layout/top-bar/breadcrumb/breadcrumb.component';
import { ListLeaComponent } from './components/lea-management/list-lea/list-lea.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TopBarComponent,
    SideBarComponent,
    DefaultLayoutComponent,
    OverviewComponent,
    LeaManagementComponent,
    AddLeaComponent,
    ClickOutsideDirective,
    BreadcrumbComponent,
    ListLeaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
