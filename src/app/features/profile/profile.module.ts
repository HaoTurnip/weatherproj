import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    title: 'User Profile'
  }
];

@NgModule({
  imports: [
    ProfileComponent,
    RouterModule.forChild(routes)
  ]
})
export class ProfileModule { } 