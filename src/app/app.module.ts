import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { WorkInstructionsComponent } from './components/workInstructions/workInstructions.page';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UsedcarsPage } from './components/usedcars/usedcars.page';
import { MyModalPageComponent } from './components/my-modal-page/my-modal-page.component';
import { SampleService } from './services/sample.service';

import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AppComponent, WorkInstructionsComponent],
  entryComponents: [],
  imports: [BrowserModule,HttpClientModule, IonicModule.forRoot(), AppRoutingModule, FormsModule],
  providers: [HttpClient,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, SampleService],
  bootstrap: [AppComponent],
})
export class AppModule {

  constructor() {

	}
}
