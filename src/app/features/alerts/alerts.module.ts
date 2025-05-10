import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertsComponent } from './alerts.component';
import { NewAlertDialogComponent } from './new-alert-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: AlertsComponent,
    title: 'Weather Alerts'
  }
];

@NgModule({
  imports: [
    AlertsComponent,
    NewAlertDialogComponent,
    RouterModule.forChild(routes)
  ]
})
export class AlertsModule { } 