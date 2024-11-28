import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';


@NgModule({
  declarations: [AppComponent],
  imports: [ AppRoutingModule, AppLayoutModule, BrowserModule,BrowserAnimationsModule],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy },provideHttpClient(
    withFetch()
  )],
  bootstrap: [AppComponent],
})
export class AppModule {}
