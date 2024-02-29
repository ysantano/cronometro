import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'juego',
    loadChildren: () => import('./pages/juego/juego.module').then( m => m.JuegoPageModule)
  },
  {
    path: 'pruebas',
    loadChildren: () => import('./pages/pruebas/pruebas.module').then( m => m.PruebasPageModule)
  },
  {
    path: 'deviceinfo',
    loadChildren: () => import('./pages/deviceinfo/deviceinfo.module').then( m => m.DeviceinfoPageModule)
  },
  {
    path: 'testsqlite',
    loadChildren: () => import('./pages/testsqlite/testsqlite.module').then( m => m.TestsqlitePageModule)
  },
  {
    path: 'estadisticasfinales',
    loadChildren: () => import('./pages/estadisticasfinales/estadisticasfinales.module').then( m => m.EstadisticasfinalesPageModule)
  },
  {
    path: 'cronome',
    loadChildren: () => import('./pages/cronome/cronome.module').then( m => m.CronomePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
