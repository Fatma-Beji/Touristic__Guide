import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { NavController, LoadingController, Item, NavParams} from 'ionic-angular';

import { WalkthroughPage } from '../walkthrough/walkthrough';


import { FeedPage } from '../feed/feed';
import 'rxjs/Rx';
import { AngularFirestoreDocument,AngularFirestore } from 'angularfire2/firestore';
import { ListingModel } from './listing.model';
import { ListingService } from './listing.service';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { ContactCardPage } from '../contact-card/contact-card';
import { RecherchePage } from '../recherche/recherche';
import { NativeStorage } from '@ionic-native/native-storage';
import { PARAMETERS } from '@angular/core/src/util/decorators';
import { LoginAdminPage } from '../login-admin/login-admin';
import { GridPage } from '../grid/grid';
import { Geolocation} from '@ionic-native/geolocation';
import { GoogleMap } from "../../components/google-map/google-map";
import { time } from 'core-js/fn/log';
import { forEach } from 'core-js/fn/array';


@Component({
  selector: 'listing-page',
  templateUrl: 'listing.html',
})
export class ListingPage {
@ViewChild('mapp') mapp: ElementRef;

  listing: ListingModel = new ListingModel();
  items;
  items1;
  ref:any;
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
  role;
  user;
  map;
  geocodedWaypointsJSON: any;
  loc;
  test:boolean=false;


  public countryList:Array<any>;
  public loadedCountryList:Array<any>;
  public ref_cities:firebase.database.Reference;


  constructor(
    public nav: NavController,
    public listingService: ListingService,
    public loadingCtrl: LoadingController,
    public angularFireDatabase:AngularFireDatabase,
    public angularFirestore: AngularFirestore,
    public navParams: NavParams,
    public nativeStorage: NativeStorage,
    public geolocation:Geolocation

  ) {


    this.loading = this.loadingCtrl.create();

    this.ref = this.angularFireDatabase.database.ref('/countries');
    this.angularFireDatabase.list('/countries').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key,...action.payload.val() }));
    }).subscribe((data) => {
      this.items=data;
      console.log(this.items);
      },
       (err)=>{ console.log( err) });




     this.ref1 = this.angularFireDatabase.database.ref('/places');
    this.angularFireDatabase.list('/places').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key,...action.payload.val() }));
    }).subscribe((data1) => {
      this.items1=data1;
      console.log(this.items1);
      },
       (err)=>{ console.log( err) });

      this.imageSource='aa';
     this.getPhotoUrl(this.imageSource);



     this.ref_cities = firebase.database().ref('/countries');

     this.ref_cities.on('value', countryList => {
       let countries = [];
       countryList.forEach( country => {
         countries.push(country.val());
         return false;
       });

       this.countryList = countries;
       this.loadedCountryList = countries;
     });


     this.nativeStorage.getItem('role')
     .then(
       d => this.role=d.role,
       error => console.error(error)
     );

     this.nativeStorage.getItem('role')
     .then(
       d1 => this.user=d1.name,
       error => console.error(error)
     );

     this.map = new google.maps.Map(ViewChild("mapp"),{
      center: {lat: 33.9, lng: 10.6},
      zoom: 6,
     });

  }

  locateMe(){
    let map=this.map;
    let place_id;
    let loc=this.loc;
    let items=this.countryList;
    let a;
    let nav=this.nav;

    this.geolocation.getCurrentPosition({maximumAge: 8000, timeout: 30000, enableHighAccuracy: true})
        .then((position) => {

            let curr_loc =  new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            console.log(JSON.stringify(curr_loc));

            var directionsService = new google.maps.DirectionsService();
            var directionsRenderer = new google.maps.DirectionsRenderer();
            var service = new google.maps.places.PlacesService(map);

            var request = {
              origin: curr_loc,
              destination: curr_loc,
              travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function(result, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                //let place_id = result.geocoded_waypoints[0].place_id;
                //console.log(place_id);

                this.geocodedWaypointsJSON = result;
                place_id=this.geocodedWaypointsJSON.geocoded_waypoints[0].place_id;
                console.log(place_id);

                directionsRenderer.setDirections(result);
                //console.log(JSON.stringify(result));

              }
              var req = {
                placeId: place_id,
                fields:['address_component', 'opening_hours', 'geometry', 'website','opening_hours','international_phone_number',
              'adr_address']
              };
              let navv=nav;
              service.getDetails(req, function(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {

                  loc=results.address_components[3].long_name;

                  console.log(JSON.stringify(results.address_components));
                  console.log(JSON.stringify(results));

                  //alert(JSON.stringify(results.address_components));
                  //alert(loc);

                  for (let index of items) {
                    if(index.name==loc){
                      //alert('aa');
                      a = index;
                      //alert('You are located in: '+JSON.stringify(a));
                      navv.push(RecherchePage, {text:a});
                    }
                  }

                }

              });
            });

        });

  }

  getPhotoUrl(i){
    firebase.storage().ref().child('imagesPlaces/' + i + '.jpg').getDownloadURL().then((url)=>{
      this.imageP=url;
    });
    //console.log(this.imageP);

  }

  ionViewDidLoad() {
    this.listingService
      .getData()
      .then(data => {
        this.listing.banner_image = data.banner_image;
        this.listing.banner_title = data.banner_title;
        this.listing.populars = data.populars;
        this.listing.categories = data.categories;
      });
  }


  goToFeed(m :any) {
    console.log("Clicked goToFeed");
    this.nav.push(ContactCardPage, {text:m});
  }

  Admin(){
    this.nav.push(GridPage);
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
    //document.getElementById("tabs").style.display="None";
    this.nav.setRoot(this.rootPage);
  }


  initializeItems(){
    this.countryList  = this.loadedCountryList;
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

    this.countryList = this.countryList.filter((v) => {
      if(v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });

    console.log(q, this.countryList.length);

  }





  goToPlace(m){
    this.nav.push(RecherchePage,{text:m});
  }

}
