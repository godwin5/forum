import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nav:NavController,
    private af:AngularFireAuth,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
     this.af.authState.subscribe(user=>{
        if(user && user.displayName){
          console.log('User');
          localStorage.setItem('userid',user.uid)
          this.nav.navigateRoot('/home');
        }
        else if(user && !user.displayName){
          console.log('No user');
          this.nav.navigateRoot('/signup');
        }
        else{
          this.nav.navigateRoot('/login');
        } 
      }) 
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
