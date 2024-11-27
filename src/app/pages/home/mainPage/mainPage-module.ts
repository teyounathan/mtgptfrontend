import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './mainPage-component';
import { MainPageRoutingModule } from './mainPage-routing-module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [MainPageComponent],
  imports: [CommonModule, MainPageRoutingModule,FormsModule,RouterModule,],
  exports:[MainPageComponent]
})
export class MainPageModule {}
