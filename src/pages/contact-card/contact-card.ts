import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

import { ContactModel } from './contact.model';
import { AdminMapPage } from '../admin-map/admin-map';
import { MapsPage } from '../maps/maps';

@Component({
  selector: 'contact-card-page',
  templateUrl: 'contact-card.html'
})
export class ContactCardPage {
  contact: ContactModel = new ContactModel();

  items
  ref:any;
  loading: any;
  public data : any;
  placeRef:any;

  imageSource;
  imageP;
  m;
  m1;
  place:boolean=false;
  p;
  ref2;
  items2;
  public pl:Array<any>;
  public loadedplacesList:Array<any>;

  constructor(
    public navCtrl: NavController,
    private emailComposer: EmailComposer,
    public inAppBrowser: InAppBrowser,
    public angularFireDatabase:AngularFireDatabase,
    public navParams: NavParams

  ) {

    this.ref = this.angularFireDatabase.database.ref('/places');

    this.angularFireDatabase.list('/places').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key,...action.payload.val() }));
    }).subscribe((data) => {
      this.items=data;

      console.log(this.items);


      },
       (err)=>{ console.log( err) });


       this.m=this.navParams.get('text');
       this.m1=this.navParams.get('text1');
      console.log(this.m.name)




      this.imageSource='aa';
     this.getPhotoUrl(this.imageSource);





  }


  //Note: we commented this method because the Call Number plugin was unstable and causing lots of errors. If you want to use it please go: https://ionicframework.com/docs/native/call-number/
  // call(number: string){
  //   this.callNumber.callNumber(number, true)
  //   .then(() => console.log('Launched dialer!'))
  //   .catch(() => console.log('Error launching dialer'));
  // }

  sendMail(){
    //for more option please go here: http://ionicframework.com/docs/native/email-composer/
     let email = {
      to: 'contact@ionicthemes.com',
      subject: 'This app is the best!',
      body: "Hello, I'm trying this fantastic app that will save me hours of development"
    };
    // Send a text message using default options
    this.emailComposer.open(email);
  }

  openInAppBrowser(website: string){
    this.inAppBrowser.create(website, '_blank', "location=yes");
  }

  getPhotoUrl(i){
    firebase.storage().ref().child('imagesPlaces/' + i + '.jpg').getDownloadURL().then((url)=>{
      this.imageP=url;
    });
    console.log(this.imageP);

  }

  openMap(m){
    this.navCtrl.push(MapsPage, {text:m, text1: this.m1});
  }

  goToPlace(m){
    this.place = true;
    this.p=m;

  }
}
