import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DomainModelModule } from './domain-model/domain-model.module';
import { AccountViewModule } from './account-view/account-view.module';
import { HomeComponent } from './home/home.component';
import { StoreModule } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import * as appReducers from './store/app.reducers';
import { EffectsModule } from '@ngrx/effects';
import { DomainModelEffects } from './domain-model/store/domain-model.effects';
import { HttpClientModule } from '@angular/common/http';
import { AccountViewComponent } from './account-view/account-view/account-view.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DomainModelModule,
    AccountViewModule,
    StoreModule.forRoot(appReducers.reducers),
    EffectsModule.forRoot([DomainModelEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
