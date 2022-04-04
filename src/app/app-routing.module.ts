import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'hub',
    loadChildren: () => import('./components/hub/hub.module').then(m => m.HubModule),
  },
  {
    path: 'privacy-law-navigator',
    loadChildren: () => import('./components/pipps/pipps.module').then(m => m.PippsModule),
  },
  {
    path: 'privacynewsfeed',
    loadChildren: () => import('./components/news-podcast/news-podcast.module').then(m => m.NewsPodcastModule),
  },
/*  {
    path: '**',
    redirectTo: ''
  },*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
