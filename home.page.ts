import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController } from "@ionic/angular";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { format } from 'timeago.js';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  postRef: Observable<any>;
  userid: string;
  constructor(
    public af: AngularFireAuth,
    public fs: AngularFirestore,
    public nav: NavController,
    public action: ActionSheetController,
    public alertCtrl: AlertController,
  ) {
    this.userid = localStorage.getItem('userid');
    this.postRef = this.fs.collection('posts', ref => ref.orderBy('Timestamp', 'desc')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    firebase.firestore().collection('likes').onSnapshot(function (snap) {
      snap.forEach(child => {
      setTimeout(() => {
        let likes: Array<any> = child.data()['Likes'];
        let postId: string = child.id;
        setTimeout(() => {
          document.getElementById('likesCount'+postId).innerHTML=likes.length.toString()+' likes';
        }, 100);
        if (likes.indexOf(firebase.auth().currentUser.uid) > -1) {
          //console.log('Liked')
          setTimeout(() => {
            document.getElementById(postId + 'like').setAttribute('name', 'ios-heart');
          }, 100);
        }
        else {
          //console.log('Not Liked')
          setTimeout(() => {
            document.getElementById(postId + 'like').setAttribute('name', 'ios-heart-empty');
          }, 100);
        }
      }, 1000);
      })
    })
    
  }
  readMore(id) {
    document.getElementById(id + 'readMore').style.display = 'none';
    document.getElementById(id + 'extra').style.display = 'inline';
  }
  async presentActionSheet() {
    const actionSheet = await this.action.create({
      header: 'More Optons',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.DeleteConfirm();
        }
      }, {
        text: 'Edit',
        icon: 'options',
        handler: () => {
          this.nav.navigateForward('/edit');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  async DeleteConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Delete!',
      message: "This action can't be undone",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',

          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Delete',
          handler: () => {
            let PostID = sessionStorage.getItem('PostId');
            this.fs.collection('posts').doc(PostID).delete();
          }
        }
      ]
    });

    await alert.present();
  }
  options(id, post) {
    sessionStorage.setItem('PostId', id);
    sessionStorage.setItem('Post', post);
    this.presentActionSheet();
  }
  timesAgo(t) {
    return format(t.toMillis());
  }
  likesArr = [];

  heart(id) {
    this.fs.collection('likes').doc(id).snapshotChanges().subscribe(data => {
      this.likesArr = data.payload.data()['Likes'];
      //console.log(this.likesArr)

    })
    if (this.likesArr.indexOf(this.userid) > -1) {
      this.fs.collection('likes').doc(id).set({
        Likes: firebase.firestore.FieldValue.arrayRemove(this.userid),
      }, { merge: true })
      document.getElementById(id + 'like').setAttribute('name', 'ios-heart-empty');
    }
    else {
      this.fs.collection('likes').doc(id).set({
        Likes: firebase.firestore.FieldValue.arrayUnion(this.userid),
      }, { merge: true })
      document.getElementById(id + 'like').setAttribute('name', 'ios-heart');
    }
  }
comment(id){
  sessionStorage.setItem('PostId',id);
  this.nav.navigateForward('/comments');
}
  gotoProfile() {
    this.nav.navigateForward('/profile');
  }
  gotoCreate() {
    this.nav.navigateForward('/create');
  }
}
