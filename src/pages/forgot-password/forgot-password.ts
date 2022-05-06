import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';

import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController } from 'ionic-angular';
import * as firebase from 'firebase';
import { LoginPage } from '../login/login';

@Component({
  selector: 'forgot-password-page',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
  forgot_password: FormGroup;
  main_page: { component: any };
  mail;
  error;

  constructor(
    public nav: NavController,
    public fireauth: AngularFireAuth,
    public toastCtrl: ToastController
    ) {

    this.main_page = { component: TabsNavigationPage };

    this.forgot_password = new FormGroup({
      email: new FormControl('', Validators.required)
    });
  }

  recoverPassword(){
    console.log(this.forgot_password.value);
    this.mail=this.forgot_password.value.email.toString();

     /* this.fireauth.auth.sendPasswordResetEmail(this.forgot_password.value)
        .then(data => {
          console.log(data);
          this.presentToast();

        })
        .catch(err => {
          console.log(` failed ${err}`);
          this.error = err.message;
        }); */


          var auth = firebase.auth();
          return auth.sendPasswordResetEmail('bejifatma9@gmail.com')
            .then(() =>{ alert("An email has been sent to recover your password"),
            this.nav.push(LoginPage)})
            .catch((error) => console.log(error))



    //this.nav.setRoot(this.main_page.component);
  }
  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'User was added successfully',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
