import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        loadChildren: () =>
          import('./mainPage/mainPage-module').then((m) => m.MainPageModule),
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./mainPage/mainPage-module').then((m) => m.MainPageModule),
      },
      
    ]),
  ],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
