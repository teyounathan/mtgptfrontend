import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from './layout/app.layout.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: AppLayoutComponent,
          children: [
            {
              path: '',
              loadChildren: () =>
                import('./pages/home/home.module').then((m) => m.HomeModule),
            },
          ],
        },
       
      ],
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        onSameUrlNavigation: 'reload',
        enableViewTransitions:true
      }
    ),
  ],
  exports: [RouterModule],
})
export class  AppRoutingModule {}
