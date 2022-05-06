import { Component,OnInit } from '@angular/core';
import { NavController, LoadingController, Button, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { SignupPage } from '../signup/signup';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import {LoginAdminPage} from '../login-admin/login-admin';

import { FacebookLoginService } from '../facebook-login/facebook-login.service';
import { GoogleLoginService } from '../google-login/google-login.service';
import { TwitterLoginService } from '../twitter-login/twitter-login.service';

import { AngularFireDatabase, snapshotChanges  } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';

import { Facebook } from '@ionic-native/facebook';

//import * as firebase from 'firebase/app';


@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit{
  login: FormGroup;
  main_page: { component: any };
  loading: any;
  ref:any;
  isuser2:boolean;
  isuser:boolean;
  data1;
  items;
  d;
  admin:boolean=false;




  constructor(
    public nav: NavController,
    public facebookLoginService: FacebookLoginService,
    public googleLoginService: GoogleLoginService,
    public twitterLoginService: TwitterLoginService,
    public loadingCtrl: LoadingController,
    public angularFireDatabase: AngularFireDatabase,
    public googlePlus: GooglePlus,
    public nativeStorage: NativeStorage,
    public fb: Facebook,
    public ngFireAuth: AngularFireAuth,
    public navParams:NavParams


  ) {
    this.main_page = { component: TabsNavigationPage };

    this.login = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    this.ref = this.angularFireDatabase.database.ref('/ionic4-4bddd');
    this.angularFireDatabase.list('/ionic4-4bddd').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key,...action.payload.val() }));
    }).subscribe((data) => {
      this.items=data;

    });

  /*  this.nativeStorage.getItem('user_login')
       .then(
         data1 => this.data1=data1.name,
         error => console.error(error)
       );

      let data = this.data1
    this.nativeStorage.setItem('profile_user',{n:data}); */


  }

  ngOnInit(){

   /* this.nativeStorage.getItem('userr').then(
      data1 => this.d=data1.name,
      error => console.error(error))
      alert(JSON.stringify(this.d)); */

   /* let test = this.nativeStorage.getItem('userr');
    if (test) {

      this.nav.setRoot(this.main_page.component);
    } */


  }

  SignIn(email, password) {
    return this.ngFireAuth.auth.signInWithEmailAndPassword(email, password)

  }

  doLogin(){

    let formData;
    formData=this.login.value;
    let user;
    let admin = this.admin ;

    this.SignIn(formData.email, formData.password)
    .then((res) => {

      if(this.SignIn){

        for (let index of this.items) {
          if(formData.email ==index.email){
            //user=index.role;
            //console.log(user);

            this.nativeStorage.setItem('userr',{name:index.name, email:index.email ,
               password:index.password ,phone:index.phone, role:index.role});

            this.nativeStorage.setItem('role',{role:index.role});
          }
          /*if(user==0){
            admin=true
          }*/

       }
       this.nav.setRoot(this.main_page.component);

      }
      else {
        alert("Incorrect Password! Please try Again");
      }


      // if(this.isEmailVerified) {
        //this.nav.setRoot('');
     // } else {
       // window.alert('Email is not verified')
       // return false;
      //}
    }).catch((error) => {
       alert(error)

  })

  }



/*	async doFacebookLogin2(){

    const loading = await this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.presentLoading(loading);
		let permission = new Array<string>();

		//the permissions your facebook app needs from the user
    const permissions = ["public_profile", "email"];

		this.fb.login(permissions)
      .then(response => {
      let userId = response.authResponse.userID;
      //Getting name and gender properties
      this.fb.api("/me?fields=name,email", permissions)
        .then(user => {
          user.picture = "https://graph.facebook.com/" +
          userId + "/picture?type=large";
          this.nativeStorage.setItem('facebook_user', {
             name: user.name,
             email: user.email,
             picture: user.picture
           })
       const facebookCredential =
        firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);

        firebase.auth().signInWithCredential(facebookCredential)
          .then((user2) => {

          this.angularFireDatabase.database.ref('/ionic4-4bddd').on('value',
            res => {
              console.log(res.val().email)
              });

          this.ref.orderByChild('user.email').equalTo(user.email).once('value',
            (snapshot) => {
              console.log(snapshot.val().email)
              this.ref.push({
                  userId: response.authResponse.userID,
                  name: user.name,
                  email: user.email,
                  picture: user.picture
              })

                .then(() => {

              this.nav.setRoot(this.main_page.component);
                 loading.dismiss();
                 }, error => {

                  console.log(error);
                  loading.dismiss();
                 })
              });
          });
         })
      }, error => {
                 console.log(error);
                 loading.dismiss();
            });
     }
*/

  async doFacebookLogin2(){
		const loading = await this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.presentLoading(loading);
		let permission = new Array<string>();

		//the permissions your facebook app needs from the user
    const permissions = ["public_profile", "email"];

		this.fb.login(permissions)
		.then(response =>{
			let userId = response.authResponse.userID;

			//Getting name and gender properties
			this.fb.api("/me?fields=name,email", permissions)
			.then(user =>{
				user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        //now we have the users info, let's save it in the NativeStorage

				this.nativeStorage.setItem('facebook_user',
				{
					name: user.name,
					email: user.email,
					picture: user.picture
        })

        let data:any;
       this.isuser2=false;

        this.angularFireDatabase.list(this.ref).valueChanges().subscribe((data) => {
          data.forEach(function (value) {
            console.log(JSON.stringify(value));

            let user2:any = value;

            if(user.email==user2.email){
              console.log(JSON.stringify(value));
              this.isuser2 = true;
              //console.log(JSON.stringify(value));
            }
        });

          },
           (err)=>{ console.log( err) });

        if(this.isuser2==false){

        this.ref.push({userId:response.authResponse.userID,name:user.name,email: user.email,picture: user.picture})

				.then(() =>{
					this.nav.setRoot(this.main_page.component);
					loading.dismiss();
				}, error =>{

					console.log(error);
					loading.dismiss();
				})
      }
      else{

        this.nativeStorage.setItem('facebook_user',
				{
					name: user.name,
					email: user.email,
          picture: user.picture
        })

        .then(() =>{
					this.nav.setRoot(this.main_page.component);
					loading.dismiss();
				}, error =>{

					console.log(error);
					loading.dismiss();
				})
      }}
      )
		}, error =>{
			console.log(error);
			loading.dismiss();
		});
	}


  async doGoogleLogin2(){
    const loading = await this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.presentLoading(loading);

    this.googlePlus.login({
      'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '163500899304-i06p98jba48954qqdaerie15dtpvigf5.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
    })
    .then(user =>{
      loading.dismiss();

      this.nativeStorage.setItem('google_user', {
        name: user.displayName,
        email: user.email,
        picture: user.imageUrl
      })

      let data:any;
      this.isuser=false;

      this.angularFireDatabase.list(this.ref).valueChanges().subscribe((data) => {
        data.forEach(function (value) {
          console.log(JSON.stringify(value));

          let user2:any = value;

          if(user.email==user2.email){
            console.log(JSON.stringify(value));
            this.isuser = true ;
            //console.log(JSON.stringify(value));
          }

      });

        },
         (err)=>{ console.log( err) });

        if(this.isuser==false){
          //console.log('hello');
      this.ref.push({name:user.displayName,email: user.email,picture:user.imageUrl})

      .then(() =>{

        this.nav.setRoot(this.main_page.component);
      }, error =>{
        console.log(error);
      })
      loading.dismiss();
    }

    else{
      this.nativeStorage.setItem('google_user', {
        name: user.displayName,
        email: user.email,
        picture: user.imageUrl
      })
      .then(() =>{

        this.nav.setRoot(this.main_page.component);
      }, error =>{
        console.log(error);
      })
      loading.dismiss();
    }})
    , err =>{
      console.log(err);
      loading.dismiss();
    };
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  doFacebookLogin() {
    this.loading = this.loadingCtrl.create();

    // Here we will check if the user is already logged in because we don't want to ask users to log in each time they open the app
    // let this = this;

    this.facebookLoginService.getFacebookUser()
    .then((data) => {
       // user is previously logged with FB and we have his data we will let him access the app
      this.nav.setRoot(this.main_page.component);
    }, (error) => {
      //we don't have the user data so we will ask him to log in
      this.facebookLoginService.doFacebookLogin()
      .then((res) => {
        this.loading.dismiss();
        this.nav.setRoot(this.main_page.component);

      }, (err) => {
        console.log("Facebook Login error", err);
      });
    });
  }

  doGoogleLogin() {
    this.loading = this.loadingCtrl.create();

    // Here we will check if the user is already logged in because we don't want to ask users to log in each time they open the app

    //this.googleLoginService.trySilentLogin()
    //.then((data) => {
       // user is previously logged with Google and we have his data we will let him access the app
    //  this.nav.setRoot(this.main_page.component);
    //}, (error) => {
      //we don't have the user data so we will ask him to log in
      this.googleLoginService.doGoogleLogin()
      .then((res) => {
        this.loading.dismiss();
        this.nav.setRoot(this.main_page.component);
      }, (err) => {
        console.log(err);
      });
    //});
  }

  doTwitterLogin(){
    this.loading = this.loadingCtrl.create();

    // Here we will check if the user is already logged in because we don't want to ask users to log in each time they open the app

    this.twitterLoginService.getTwitterUser()
    .then((data) => {
       // user is previously logged with FB and we have his data we will let him access the app
      this.nav.setRoot(this.main_page.component);
    }, (error) => {
      //we don't have the user data so we will ask him to log in
      this.twitterLoginService.doTwitterLogin()
      .then((res) => {
        this.loading.dismiss();
        this.nav.setRoot(this.main_page.component);
      }, (err) => {
        console.log("Twitter Login error", err);
      });
    });
  }

  goToSignup() {
    this.nav.push(SignupPage);
  }

  goToForgotPassword() {
    this.nav.push(ForgotPasswordPage);
  }

  goToAdminLogin() {
    this.nav.push(LoginAdminPage);
  }

}
