import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CoreModule,
    ModalModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
