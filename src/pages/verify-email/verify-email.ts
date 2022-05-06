import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';


@IonicPage()
@Component({
  selector: 'page-verify-email',
  templateUrl: 'verify-email.html',
})
export class VerifyEmailPage {



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public nav: NavController,
    public ngFireAuth: AngularFireAuth
    ) {

  }



}
