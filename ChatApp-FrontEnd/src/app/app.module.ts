import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AuthModule } from './modules/auth.module';
//import { StreamsComponent } from './components/streams/streams.component';
import { AuthRoutingModule } from './modules/auth-routing.module';
import { StreamsModule } from './modules/streams.module';
import { StreamsRoutingModule } from './modules/streams-routing.module';
//import { Routes } from '@angular/router';
//import { AuthTabsComponent } from './components/auth-tabs/auth-tabs.component';

// const appRoutes: Routes = [
//   { path: 'auth', component: AuthTabsComponent },
//   { path: 'streams', component: StreamsComponent },
// ];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    //AppRoutingModule,
    AuthModule,
    AuthRoutingModule,
    StreamsModule,
    StreamsRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
