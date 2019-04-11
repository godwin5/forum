import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from "@ionic/angular";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  pwd: string;
  errMsg: string;
  constructor(
    public af: AngularFireAuth,
    public fs: AngularFirestore,
    public nav: NavController,
    public alertCtrl: AlertController,
  ) { }

  ngOnInit() {
  }

  async presentAlert() {
    const errorAlert = await this.alertCtrl.create({
      header: 'Oops',
      message: this.errMsg,
      buttons: [
        { text: 'ok' }
      ]
    })
    await errorAlert.present();
  }
  login() {
    document.getElementById('loginLoader').style.display = 'block';
    this.af.auth.signInWithEmailAndPassword(this.email, this.pwd).then(() => {
      document.getElementById('loginLoader').style.display = 'none';
      this.nav.navigateRoot('/home');
    }).catch(err => {
      document.getElementById('loginLoader').style.display = 'none';
      this.errMsg = err.message;
      this.presentAlert();
    })
  }
  goto_signup() {
    this.nav.navigateForward('/signup');
  }
}
