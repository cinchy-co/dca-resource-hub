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
  },
  {
    path: 'news-podcast',
    loadChildren: () => import('./components/news-podcast/news-podcast.module').then(m => m.NewsPodcastModule),
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
