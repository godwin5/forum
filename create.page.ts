import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { NavController, IonInput } from "@ionic/angular";
import * as firebase from 'firebase';
@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  @ViewChild('textarea') textarea: IonInput;
  postBtn: boolean = true;
  input: string = '';
  userid: string;
  name: string;
  bio: string;
  photo: string;
  constructor(
    public af: AngularFireAuth,
    public fs: AngularFirestore,
    public nav: NavController,
  ) {
    //Get User Data from Firestore
    this.userid = this.af.auth.currentUser.uid;
    this.fs.collection('users').doc(this.userid).snapshotChanges()
      .subscribe(val => {
        let data = val.payload.data();
        this.name = data['Name'];
        this.bio = data['Bio'];
        this.photo = data['Photo'];
      });

    //Set Focus
    setTimeout(() => {
      this.textarea.setFocus();
    }, 100);
  }

  check() {
    if (this.input == '') {
      this.postBtn = true
    }
    else {
      this.postBtn = false;
    }
  }
  post() {
    //Replace all new line with break tag(<br />)
    let getLineBreaks = this.input.replace(/\n\r?/g, '<br />');
    if (this.input != '') {
      document.getElementById('postLoader').style.display = "block";
      this.fs.collection('posts').add({
        Name: this.name,
        Post: getLineBreaks,
        Timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        Photo: this.photo,
        UID:this.userid,
      
      }).then(d => {
        this.fs.collection('likes').doc(d.id).set({
          Likes:[],
        }).then(()=>{
          document.getElementById('postLoader').style.display = 'none';
          this.nav.navigateRoot('/home');
        })
        
      }).catch(err => {
        document.getElementById('postLoader').style.display = 'none';
        alert(err.message);
      })
    }
  }
  ngOnInit() {
  }

}
