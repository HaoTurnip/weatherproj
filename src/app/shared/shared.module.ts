import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';

// Standalone Components, Pipes, Directives
import { WeatherCardComponent } from './components/weather-card/weather-card.component';
import { AlertCardComponent } from './components/alert-card/alert-card.component';
import { HeaderComponent } from './components/header/header.component';
import { TemperaturePipe } from './pipes/temperature.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatMenuModule,
    MatChipsModule,
    WeatherCardComponent,
    AlertCardComponent,
    HeaderComponent,
    TemperaturePipe,
    DateFormatPipe
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatMenuModule,
    MatChipsModule,
    WeatherCardComponent,
    AlertCardComponent,
    HeaderComponent,
    TemperaturePipe,
    DateFormatPipe
  ]
})
export class SharedModule { } 