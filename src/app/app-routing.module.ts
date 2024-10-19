import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OverviewComponent } from './components/overview/overview.component';
import { LeaManagementComponent } from './components/lea-management/lea-management.component';
import { AddLeaComponent } from './components/lea-management/add-lea/add-lea.component';
import { ListLeaComponent } from './components/lea-management/list-lea/list-lea.component';

const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { breadcrumb: 'Dashboard' },
  },
  {
    path: 'overview',
    component: OverviewComponent,
    data: { breadcrumb: 'Overview' }
  },
  {
    path: 'lea-management',
    component: LeaManagementComponent,
    data: { breadcrumb: 'LEA Management' },
    children: [
      {
         path: '',
         redirectTo: 'list-lea',
         pathMatch: 'full'
      },
      {
         path: 'list-lea',
         component: ListLeaComponent,
         data: {
          breadcrumb: 'List LEA'
         }
      },
      {
        path: 'add-lea',
        component: AddLeaComponent,
        data: {
          breadcrumb: 'Add LEA'
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
