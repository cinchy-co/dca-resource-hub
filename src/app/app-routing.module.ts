import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingComponent} from "./components/landing/landing.component";

const routes: Routes = [
  {
    path: 'landing',
    component: LandingComponent
  },
  {
    path: '',
    loadChildren: () => import('./components/hub/hub.module').then(m => m.HubModule),
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
