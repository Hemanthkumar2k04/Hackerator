import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/home/home.component';
import { provideRouter, Route } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

const routes: Route[] = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent}
]

const appConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
  ]
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
