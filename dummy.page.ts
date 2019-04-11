import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AlertController } from "@ionic/angular";
@Component({
  selector: 'app-dummy',
  templateUrl: './dummy.page.html',
  styleUrls: ['./dummy.page.scss'],
})
export class DummyPage implements OnInit {
  username;
  pwd;
  constructor(
    public af: AngularFireAuth,
    public alertCtrl: AlertController,
  ) { }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Oops',
      message: 'Username already exists',
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }

  check() {
    this.af.auth.createUserWithEmailAndPassword(this.username + '@test.com', this.pwd).then(() => {
      confirm('Username available');
    }).catch(err => {
      if (err.code == 'auth/email-already-in-use') {
        this.presentAlert();
      }
    })
  }
  ngOnInit() {
  }

}
