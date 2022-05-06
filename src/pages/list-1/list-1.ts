import { Component, OnInit} from '@angular/core';
import { NavController, LoadingController, Item, NavParams } from 'ionic-angular';
import { WalkthroughPage } from '../walkthrough/walkthrough';
import 'rxjs/Rx';

import { List1Model } from './list-1.model';
import { List1Service } from './list-1.service';

import { UpdatePage } from '../update/update';
import { FormLayoutPage } from '../form-layout/form-layout';
import { ContactCardPage } from '../contact-card/contact-card';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestoreDocument,AngularFirestore } from 'angularfire2/firestore';
import { updateDate } from 'ionic-angular/umd/util/datetime-util';
import { GridPage } from '../grid/grid';
import { VillePage } from '../ville/ville';
import * as firebase from 'firebase';




@Component({
  selector: 'list-1-page',
  templateUrl: 'list-1.html'
})
export class List1Page  {

  items
  ref:any;
  list1: List1Model = new List1Model();
  loading: any;
  public data : any;
  placeRef:any;
  itemDoc:AngularFirestoreDocument<Item>;

  imageSource;
  imageP;
  m;
  rootPage: any = WalkthroughPage;

  constructor(
    public nav: NavController,
    public list1Service: List1Service,
    public loadingCtrl: LoadingController,
    public angularFireDatabase:AngularFireDatabase,
    public angularFirestore: AngularFirestore,
    public navParams: NavParams

  ) {
    this.loading = this.loadingCtrl.create();
    this.ref = this.angularFireDatabase.database.ref('/places');

    this.angularFireDatabase.list('/places').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key,...action.payload.val() }));
    }).subscribe((data) => {
      this.items=data;

      console.log(this.items);


      },
       (err)=>{ console.log( err) });

      //(this.angularFirestore.collection<any>('/places'));


      this.imageSource='aa';
     this.getPhotoUrl(this.imageSource);


     this.m=this.navParams.get('text');
     console.log(this.m);


  }

/*  ngOnInit(){
    this.angularFireDatabase.list(this.ref).valueChanges().subscribe((data) => {
      this.data=data;

      console.log(this.data);


      },
       (err)=>{ console.log( err) });
  }

  ionViewDidLoad() {
    this.loading.present();
    this.list1Service
      .getData()
      .then(data => {
        this.list1.items = data.items;
        this.loading.dismiss();
      });
  } */

  goToAddPlace(){
      this.nav.push(FormLayoutPage,{text:this.m});
  }

  OpenPlace(m){
    this.nav.push(ContactCardPage,{text:m});
  }

  getPlace(id: string) {
    this.placeRef = this.angularFireDatabase.object('/places/' + id);
    return this.placeRef;
  }

  deletePlace(m) {

    console.log(m);
    console.log(m.key)
    //this.angularFireDatabase.list('/places').remove(m.name);
    //console.log(m);
    this.angularFireDatabase.list('places/').remove(m.key);

    //this.data.splice(i,1);
  }

  goToEditPage(m){
    console.log(m);
    console.log(m.key);
    this.nav.push(UpdatePage,{text:m});
  }

  getPhotoUrl(i){
    firebase.storage().ref().child('imagesPlaces/' + i + '.jpg').getDownloadURL().then((url)=>{
      this.imageP=url;
    });
    //console.log(this.imageP);

  }

  goToCountries(){
    this.nav.push(VillePage);
  }

  goToCategories(){
    this.nav.push(GridPage);
  }

  goToPlaces(){
    this.nav.push(List1Page);
  }


  logout() {

    // navigate to the new page if it is not the current page
    this.nav.setRoot(this.rootPage);
  }



}
