import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { FacebookUserModel } from './facebook-user.model';
import { FacebookLoginService } from './facebook-login.service';
import { AngularFireDatabase  } from 'angularfire2/database';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'facebook-login-page',
  templateUrl: 'facebook-login.html'
})
export class FacebookLoginPage {
  user: FacebookUserModel = new FacebookUserModel();
  loading: any;
  ref:any;

  constructor(
    public nav: NavController,
    public facebookLoginService: FacebookLoginService,
    public loadingCtrl: LoadingController,
    public angularFireDatabase: AngularFireDatabase,
    public nativeStorage: NativeStorage
  ) {
    this.loading = this.loadingCtrl.create();
    this.ref = this.angularFireDatabase.database.ref('/ionic4-4bddd');
  }

  ionViewDidLoad(){
    this.loading.present();

    this.facebookLoginService.getFacebookUser()
    .then((user) => {
      this.user = user;
      this.loading.dismiss();
    }, (error) => {
      console.log(error);
      this.loading.dismiss();
    });
  }

  doFacebookLogout(){

    this.facebookLoginService.doFacebookLogout()
    .then((res) => {
      this.user = new FacebookUserModel();
    }, (error) => {
      console.log("Facebook logout error", error);
    });
  }

  doFacebookLogin() {

    this.nativeStorage.setItem('logOut', {property: 'facebook_user'})
    .then(
      data => 'facebook_user',
      error => console.error(error)
  )

    this.facebookLoginService.doFacebookLogin()
    .then((user) => {
      this.user = user;
      //this.ref.push({FacebookUserModel});
    }, (err) => {
      console.log("Facebook Login error", err);
    });
  }
}
