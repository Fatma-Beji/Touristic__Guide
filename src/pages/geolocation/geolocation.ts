import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Geolocation} from '@ionic-native/geolocation';
//import { Platform } from 'ionic-angular';
import { MapsPage } from '../maps/maps';
import { FichePlacePage } from '../fiche-place/fiche-place';

//declare var google;

@Component({
  selector: 'page-geolocation',
  templateUrl: 'geolocation.html',
})
export class GeolocationPage {

  data;
  latitude;
  longitude;
  time;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public geolocation :Geolocation

    //public backgroundGeolocation: BackgroundGeolocation

    ) {
      //this.loadMap();

  }

  LocateMe(){
      this.geolocation.getCurrentPosition().then((position) => {
        this.latitude=position.coords.latitude;
        this.longitude=position.coords.longitude;
        this.time=position.timestamp;
        this.data = 'Latitude:' + position.coords.latitude + 'Longitude:' + position.coords.longitude + 'Timestamp' +
        position.timestamp;
        console.log(this.data);

      }).catch((error) => {
        console.log('Error getting location', error);
      });

  }

  //  loadMap(){

       // this.geolocation.getCurrentPosition().then((position) => {
        //position.coords.latitude;
        //position.coords.longitude;
        //position.timestamp;

      //}).catch((error) => {
        //console.log('Error getting location', error);
      //});

      //let watch = this.geolocation.watchPosition();
      //watch.subscribe((data) => {

       //data.coords.latitude
       //data.coords.longitude
       //data.timestamp;
      //});
    //}


  ionViewDidLoad() {
    console.log('ionViewDidLoad GeolocationPage');
  }

  map(){
    this.navCtrl.push(MapsPage);
  }

  fiche(){
    this.navCtrl.push(FichePlacePage);
  }

}
