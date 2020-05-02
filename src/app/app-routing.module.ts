import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AccountViewComponent } from './account-view/account-view/account-view.component';


const appRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'accounts', component: AccountViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
