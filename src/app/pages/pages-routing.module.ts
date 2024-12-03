import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
      // {
      //   path: 'auth',
      //   loadChildren: () =>
      //     import('./auth/auth.module').then((m) => m.AuthModule),
      // },
    ]),
  ],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
