import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainPageComponent } from './mainPage-component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MainPageComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class MainPageRoutingModule {
  
}
