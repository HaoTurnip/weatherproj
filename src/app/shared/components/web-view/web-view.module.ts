import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebViewComponent } from './web-view.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    WebViewComponent
  ],
  exports: [WebViewComponent]
})
export class WebViewModule { } 