import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { NavController } from "@ionic/angular";
@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  postInput: string;
  postBtn: boolean = true;
  constructor(
    public fs: AngularFirestore,
    public nav: NavController,
  ) {
    this.postInput = sessionStorage.getItem('Post').replace(/<br\s*\/?>/mg, "\n");

  }
  check() {
    if (this.postInput == '') {
      this.postBtn = true
    }
    else {
      this.postBtn = false;
    }
  }
  post() {
    //Replace all new line with break tag(<br />)
    let getLineBreaks = this.postInput.replace(/\n\r?/g, '<br />');
    if (this.postInput != '') {
      document.getElementById('editLoader').style.display = "block";
      this.fs.collection('posts').doc(sessionStorage.getItem('PostId')).update({
        Post: getLineBreaks,
       
      }).then(() => {
        document.getElementById('editLoader').style.display = 'none';
        this.nav.pop();
      }).catch(err => {
        document.getElementById('editLoader').style.display = 'none';
        alert(err.message);
      })
    }
  }
  ngOnInit() {
  }

}
