import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from 'rxjs';
import { ActionSheetController, AlertController, NavController } from "@ionic/angular";
import { map } from 'rxjs/operators';
import { format } from 'timeago.js';
import * as firebase from 'firebase';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userid: string;
  name: string;
  bio: string;
  photo: string;
  postRef: Observable<any>;
  postCount:number=0;
  constructor(
    public af: AngularFireAuth,
    public fs: AngularFirestore,
    public action: ActionSheetController,
    public alertCtrl:AlertController,
    public nav:NavController,
  ) {
    this.userid = this.af.auth.currentUser.uid;
    this.fs.collection('users').doc(this.userid).snapshotChanges()
      .subscribe(val => {
        let data = val.payload.data();
        this.name = data['Name'];
        this.bio = data['Bio'];
        this.photo = data['Photo'];
      });
    this.fs.collection('posts', ref => ref.where('UID', '==', this.userid)).snapshotChanges()
      .subscribe(data => {
        this.postCount=data.length;
      })
    this.postRef = this.fs.collection('posts', ref => ref.orderBy('Timestamp', 'desc')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    firebase.firestore().collection('likes').onSnapshot(function (snap) {
      snap.forEach(child => {
        let likes: Array<any> = child.data()['Likes'];
        let postId: string = child.id;
        setTimeout(() => {
          document.getElementById('plikesCount'+postId).innerHTML=likes.length.toString()+' likes';
        }, 100);
        if (likes.indexOf(firebase.auth().currentUser.uid) > -1) {
          //console.log('Liked')
          setTimeout(() => {
            document.getElementById(postId + 'plike').setAttribute('name', 'ios-heart');
          }, 100);
        }
        else {
          //console.log('Not Liked')
          setTimeout(() => {
            document.getElementById(postId + 'plike').setAttribute('name', 'ios-heart-empty');
          }, 100);
        }
      })
    })
  }
  readMore(id) {
    document.getElementById(id+'PreadMore').style.display='none';
    document.getElementById(id+'Pextra').style.display='inline';
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
      },  {
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
            let PostID=sessionStorage.getItem('PostID');
            this.fs.collection('posts').doc(PostID).delete();
          }
        }
      ]
    });

    await alert.present();
  }
  options(id,post) {
    sessionStorage.setItem('PostID',id);
    sessionStorage.setItem('Post',post);
    this.presentActionSheet();
  }
  timesAgo(t) {
    return format(t.toMillis());
  }
  likesArr=[];
  heart(id) {
    this.fs.collection('likes').doc(id).snapshotChanges().subscribe(data => {
      this.likesArr = data.payload.data()['Likes'];
      //console.log(this.likesArr)

    })
    if (this.likesArr.indexOf(this.userid) > -1) {
      this.fs.collection('likes').doc(id).set({
        Likes: firebase.firestore.FieldValue.arrayRemove(this.userid),
      }, { merge: true })
      document.getElementById(id + 'plike').setAttribute('name', 'ios-heart-empty');
    }
    else {
      this.fs.collection('likes').doc(id).set({
        Likes: firebase.firestore.FieldValue.arrayUnion(this.userid),
      }, { merge: true })
      document.getElementById(id + 'plike').setAttribute('name', 'ios-heart');
    }
  }
comment(id){
  sessionStorage.setItem('PostId',id);
  this.nav.navigateForward('/comments');
}
  ngOnInit() {
  }

}
