import { NgModule } from '@angular/core';
import { AppLayoutComponent } from './app.layout.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [AppLayoutComponent],
  imports: [BrowserModule, RouterModule],
  exports: [AppLayoutComponent],
})
export class AppLayoutModule {}
