import { Component } from '@angular/core';
import { NavController, LoadingController, Item, NavParams } from 'ionic-angular';

import { WalkthroughPage } from '../walkthrough/walkthrough';


import { FeedPage } from '../feed/feed';
import 'rxjs/Rx';
import { AngularFirestoreDocument,AngularFirestore } from 'angularfire2/firestore';
//import { ListingModel } from './listing.model';
//import { ListingService } from './listing.service';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { ContactCardPage } from '../contact-card/contact-card';
import { DataS } from './recherche.service';



@Component({
  selector: 'listing-page',
  templateUrl: 'recherche.html',
})
export class RecherchePage {
  //listing: ListingModel = new ListingModel();
  items;
  items1;
  //ref:any;
  ref1:any;
  loading: any;
  public data : any;
  data1:any;
  placeRef:any;
  itemDoc:AngularFirestoreDocument<Item>;

  imageSource;
  imageP;
  rootPage: any = WalkthroughPage;

  searchTerm : any="";
  Data : any;
  m;
  ref2;
  items2;

  public pl:Array<any>;
  public placesList:Array<any>;
  public loadedplacesList:Array<any>;
  public ref:firebase.database.Reference;


  constructor(
    public nav: NavController,
    //public listingService: ListingService,
    public loadingCtrl: LoadingController,
    public angularFireDatabase:AngularFireDatabase,
    public angularFirestore: AngularFirestore,
    public navParams: NavParams,
    public dataS: DataS,

  ) {
    this.loading = this.loadingCtrl.create();

    this.ref = firebase.database().ref('/places');

    this.ref.on('value', countryList => {
      let countries = [];
      countryList.forEach( country => {
        countries.push(country.val());
        return false;
      });

      this.placesList = countries;

    });



    this.ref1 = this.angularFireDatabase.database.ref('/places');
    this.angularFireDatabase.list('/places').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key,...action.payload.val() }));
    }).subscribe((data1) => {
      this.items1=data1;
      console.log(this.items1);
      },
       (err)=>{ console.log( err) });


    this.m=this.navParams.get('text');
    console.log(this.m.name);


    this.ref2 = angularFireDatabase.database.ref('/places');
    this.angularFireDatabase.list('/places').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key,...action.payload.val() }));
    }).subscribe((data1) => {
      this.items2=data1;

      let places = [];
      for (let index of this.items2 ) {
        if(index.country==this.m.name){
          places.push(index);

        }

      }
      this.pl=places;
      this.loadedplacesList = places;

      },
       (err)=>{ console.log( err) });





  }

  getPhotoUrl(i){
    firebase.storage().ref().child('imagesPlaces/' + i + '.jpg').getDownloadURL().then((url)=>{
      this.imageP=url;
    });
    console.log(this.imageP);

  }

  initializeItems(){
    this.pl  = this.loadedplacesList;
  }

  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;


    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    this.pl = this.pl.filter((v) => {
      if(v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });

    console.log(q, this.pl.length);

  }



  getItemsFromCat(cat) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    //var q = cat.target.value;
    console.log(cat);


    // if the value is an empty string don't filter the items
    if (!cat) {
      return;
    }
    if(cat=='All'){
      this.initializeItems();
      return this.pl;
    }
    else {
    this.pl = this.pl.filter((v) => {
      if(v.category && cat) {
        if (v.category.toLowerCase().indexOf(cat.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }
    //console.log(cat, this.placesList.length);

  }

 // ionViewDidLoad(){
   // this.setFilteredItems();
 // }

 // setFilteredItems() {

    //this.Data = this.dataS.filterItems(this.searchTerm);

  //}



  goToFeed(m :any,m1: any) {
    console.log("Clicked goToFeed");
    this.nav.push(ContactCardPage, {text:m, text1:m1});
  }

  logout() {

    this.nav.setRoot(this.rootPage);
  }

}



