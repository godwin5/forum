import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


//Firebase
var config = {
    apiKey: "AIzaSyC0g8CbODG4EBwW6-JNiobgUsLGDtiRdzc",
    authDomain: "xoxo-978ea.firebaseapp.com",
    databaseURL: "https://xoxo-978ea.firebaseio.com",
    projectId: "xoxo-978ea",
    storageBucket: "xoxo-978ea.appspot.com",
    messagingSenderId: "710270535071"
  };

  import { AngularFireModule } from "@angular/fire";
  import { AngularFireAuthModule } from "@angular/fire/auth";
  import { AngularFirestoreModule } from "@angular/fire/firestore";
  import { AngularFireStorageModule } from "@angular/fire/storage";
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,AngularFireModule.initializeApp(config),
  AngularFireAuthModule,AngularFirestoreModule.enablePersistence(),AngularFireStorageModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
