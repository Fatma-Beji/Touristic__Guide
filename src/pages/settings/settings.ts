import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, Platform, normalizeURL } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';

import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';

import { WalkthroughPage } from '../walkthrough/walkthrough';

import 'rxjs/Rx';

import { ProfileModel } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from "../../providers/language/language.service";
import { LanguageModel } from "../../providers/language/language.model";
import { AppRate } from '@ionic-native/app-rate';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { NativeStorage } from '@ionic-native/native-storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestoreDocument,AngularFirestore } from 'angularfire2/firestore';

import {FacebookLoginPage} from '../facebook-login/facebook-login';
import { FormValidationsPage } from '../form-validations/form-validations';

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  settingsForm: FormGroup;
  // make WalkthroughPage the root (or first) page
  rootPage: any = WalkthroughPage;
  loading: any;

  profile: ProfileModel = new ProfileModel();
  languages: Array<LanguageModel>;

  items
  ref:any;
  public data : any;
  placeRef:any;
  data1;

  imageSource;
  img;
  selected_image;
  selected_img;
  results:any;
  dataa;
  user;
  user_key;
  lang;
  update_img;
  bool: boolean=false;
  name;

  constructor(
    public nav: NavController,
    public modal: ModalController,
    public loadingCtrl: LoadingController,
    public translate: TranslateService,
    public languageService: LanguageService,
    public profileService: ProfileService,
    public appRate: AppRate,
    public imagePicker: ImagePicker,
    public cropService: Crop,
    public platform: Platform,
    public nativeStorage: NativeStorage,
    public angularFireDatabase:AngularFireDatabase,
    public angularFirestore: AngularFirestore,


  ) {
    this.nativeStorage.getItem('userr')
      .then(
        data1 => this.data1=data1.name,
        error => console.error(error)
      );

       this.nativeStorage.getItem('userr')
      .then(
        data => this.user=data.email,
        error => console.error(error)
      );

    this.loading = this.loadingCtrl.create();

    this.ref = this.angularFireDatabase.database.ref('/ionic4-4bddd');

    this.angularFireDatabase.list('/ionic4-4bddd').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key,...action.payload.val() }));
    }).subscribe((data) => {
      this.items=data;

      console.log(this.items);


      for (let index of this.items) {
        if(this.user == index.email){

          this.selected_img=index.img
          this.name=index.name
          //alert(this.selected_img);
        }
      }

      });




    this.languages = this.languageService.getLanguages();

    this.settingsForm = new FormGroup({
      name: new FormControl(this.data1),
      location: new FormControl(),
      language: new FormControl(),
      pwd:  new FormControl(),
      confirmed_pwd:  new FormControl(),

      notifications: new FormControl(),

    });


  }

  ionViewDidLoad() {
    this.loading.present();
    this.profileService.getData().then(data => {
      this.profile.user = data.user;
      // setValue: With setValue, you assign every form control value at once by passing in a data object whose properties exactly match the form model behind the FormGroup.
      // patchValue: With patchValue, you can assign values to specific controls in a FormGroup by supplying an object of key/value pairs for just the controls of interest.
      // More info: https://angular.io/docs/ts/latest/guide/reactive-forms.html#!#populate-the-form-model-with-_setvalue_-and-_patchvalue_

      let currentLang = this.translate.currentLang;

      this.settingsForm.patchValue({
        name: this.data1,
        location: data.user.location,


        description: data.user.about,
        currency: 'dollar',
        weather: 'fahrenheit',
        notifications: true,
        language: this.languages.filter(x => x.code == currentLang)
      });

      this.loading.dismiss();

      this.settingsForm.get('language').valueChanges.subscribe((lang) => {
        this.setLanguage(lang);
      });
    });
  }

  editPlaces(){

    for (let index of this.items) {
      if(this.user == index.email){
        this.user_key=index.key
        this.selected_img=index.img
      }
    }

    this.results =  'data:image/jpeg;base64,' + this.results;
    //alert(this.user);

    //console.log(m);
    let formData;
    formData=this.settingsForm.value;
    console.log(formData.title);

    this.angularFireDatabase.list('/ionic4-4bddd').update(this.user_key,{
    name: formData.name,
    location: formData.location,
    language:formData.language,
    img: this.results,
    pwd: formData.pwd,
    confirmed_pwd: formData.confirmed_pwd
  })

    }

  changePassword(){
      let user=this.user_key;
      this.nav.push(FormValidationsPage,{text:user});
   }

    openImagePicker1(){
      this.imagePicker.hasReadPermission().then(
        (result) => {
          if(result == false){
            // no callbacks required as this opens a popup which returns async
            this.imagePicker.requestReadPermission();

          }
          else if(result == true){
            this.imagePicker.getPictures({
              maximumImagesCount: 1,
        //width: int,
        //height: int,
        outputType: 1
            }).then(
              (results) => {
                this.results = results;
                this.update_img=this.results;
                this.bool=true;

              /*  for (var i = 0; i < results.length; i++) {
                  let a='data:image/jpeg;base64,' + JSON.stringify(results[i]);
                  this.ref.push({image: a});
                }  */


              }, (err) => console.log(err)
            );
          }
        }, (err) => {
          console.log(err);
        });
      }



  logout() {

    /*  this.nativeStorage.getItem('facebook_user')
      .then(
        (data) => {
             if ( data == 'facebook_user' ) {

              this.facebookLoginPage.doFacebookLogout()
             }


        },
        error => console.error(error)
    ) */


    // navigate to the new page if it is not the current page
    this.nav.setRoot(this.rootPage);
    this.nativeStorage.remove('userr');

  }

  showTermsModal() {
    let modal = this.modal.create(TermsOfServicePage);
    modal.present();
  }

  showPrivacyModal() {
    let modal = this.modal.create(PrivacyPolicyPage);
    modal.present();
  }

  setLanguage(lang: LanguageModel){
    let language_to_set = this.translate.getDefaultLang();

    if(lang){
      language_to_set = lang.code;
    }
    this.translate.setDefaultLang(language_to_set);
    this.translate.use(language_to_set);
  }

  rateApp(){
    if(this.platform.is('cordova')){
      this.appRate.preferences.storeAppURL = {
        ios: '<my_app_id>',
        android: 'market://details?id=<package_name>',
        windows: 'ms-windows-store://review/?ProductId=<Store_ID>'
      };

      this.appRate.promptForRating(true);
    }
    else{
      console.log("You are not in a cordova environment. You should test this feature in a real device or an emulator");
    }
  }

  openImagePicker(){
   this.imagePicker.hasReadPermission().then(
     (result) => {
       if(result == false){
         // no callbacks required as this opens a popup which returns async
         this.imagePicker.requestReadPermission();
       }
       else if(result == true){
         this.imagePicker.getPictures({ maximumImagesCount: 1 }).then(
           (results) => {
             for (var i = 0; i < results.length; i++) {
               this.cropService.crop(results[i], {quality: 75}).then(
                 newImage => {
                   let image  = normalizeURL(newImage);
                   this.selected_image = image;
                   this.profileService.setUserImage(image);
                   this.profile.user.image = image;
                 },
                 error => console.error("Error cropping image", error)
               );
             }
           }, (err) => console.log(err)
         );
       }
     }, (err) => {
       console.log(err);
     });
  }




    uploadImage(imageURI){
      //this.imageName=this.post_form.value.title;
      return new Promise<any>((resolve, reject) => {
        //let storageRef = firebase.storage().ref();
        //let imageRef = storageRef.child('imagesPlaces/'+ this.imageName +'.jpg');
        let imageRef
        this.encodeImageUri(imageURI, function(image64){
          console.log('image= '+JSON.stringify(image64));

          imageRef.putString(image64, 'data_url')
          .then(snapshot => {
            resolve(snapshot.downloadURL);

          }, err => {
            reject(err);
          })

        })
      })
    }

    encodeImageUri(imageUri, callback) {
      var c = document.createElement('canvas');
      var ctx = c.getContext("2d");
      var img = new Image();
      img.onload = function () {
        var aux:any = this;
        c.width = aux.width;
        c.height = aux.height;
        ctx.drawImage(img, 0, 0);
        var dataURL = c.toDataURL("image/jpeg");
        callback(dataURL);
      };
      img.src = imageUri;

    };

}
