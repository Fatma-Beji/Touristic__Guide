import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Validators, FormGroup, FormControl } from '@angular/forms';

import { AngularFireDatabase } from 'angularfire2/database';
import { VillePage } from '../ville/ville';
import { GridPage } from '../grid/grid';


@IonicPage()
@Component({
  selector: 'page-login-admin',
  templateUrl: 'login-admin.html',
})
export class LoginAdminPage {

  login: FormGroup;
  ref:any;
  VillePage: { component: any };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public angularFireDatabase: AngularFireDatabase

    )
    {
      this.VillePage = { component: GridPage };

      this.login = new FormGroup({
        email: new FormControl('', Validators.required),
        password: new FormControl('test', Validators.required)
      });
      this.ref = this.angularFireDatabase.database.ref('/data');

  }

  doLogin(){

    let formData;
    formData=this.login.value;

    if(formData.email=='admin@gmail.com' && formData.password=='admin'){
      this.navCtrl.setRoot(this.VillePage.component);
    }


  }

}
