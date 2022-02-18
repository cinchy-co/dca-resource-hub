import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'legislation',
    loadChildren: () => import('./components/pipps/pipps.module').then(m => m.PippsModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
