import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { NavController, LoadingController, ToastController, NavParams } from 'ionic-angular';
import { Geolocation} from '@ionic-native/geolocation';
import { Keyboard } from '@ionic-native/keyboard';

import { Observable } from 'rxjs/Observable';

import { GoogleMap } from "../../components/google-map/google-map";
import { GoogleMapsService } from "./maps.service";
import { MapsModel, MapPlace } from './maps.model';
import { GeolocationPage } from '../geolocation/geolocation';
import { AngularFireDatabase } from 'angularfire2/database';
import { reduce } from 'rxjs/operators';
import { clear } from 'core-js/fn/log';

//google place -- google direction -- geolocation
//tahwissa

@Component({
  selector: 'maps-page',
  templateUrl: 'maps.html'
})

export class MapsPage implements OnInit {
  @ViewChild(GoogleMap) _GoogleMap: GoogleMap;
  @ViewChild('map') mapElement: ElementRef;
  map_model: MapsModel = new MapsModel();
  toast: any;

  data;
  latitude;
  longitude;
  time;
  mapOptions;
  current_location;
  map:any;
  marker:any;
  infoWindow;
  ref1;
  items1;
  m;
  m1;
  location;
  place_marker;


  constructor(
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public GoogleMapsService: GoogleMapsService,
    public geolocation: Geolocation,
    public keyboard: Keyboard,
    public angularFireDatabase:AngularFireDatabase,
    public navParams: NavParams
  ) {

    this.ref1 = this.angularFireDatabase.database.ref('/places');
    this.angularFireDatabase.list('/places').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key,...action.payload.val() }));
    }).subscribe((data1) => {
      this.items1=data1;
      console.log(this.items1);
      },
       (err)=>{ console.log( err) });


     this.m=this.navParams.get('text');
     this.m1=this.navParams.get('text1');
     console.log(this.m.latitude);
     console.log(this.m.longitude);


  }


  ngOnInit() {
    let _loading = this.loadingCtrl.create();
    _loading.present();

    this._GoogleMap.$mapReady.subscribe(map => {
      this.map_model.init(map);
      _loading.dismiss();
    });

    this.map = new google.maps.Map(document.getElementById("map"), this.mapOptions);

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 33.9, lng: 10.6},
      zoom: 6,

    });



 /*   for ( var index of this.m1) {
      console.log(index.adr);
      this.place_marker = new google.maps.Marker({
        position: new google.maps.LatLng( index.latitude,index.longitude),
        map: this.map,
        icon: '../../assets/images/maps/icons8-marqueur-40 (1).png'
      });
      var infowindow = new google.maps.InfoWindow({
        content: index.adr
      });

      infowindow.open(this.map,this.place_marker);
    } */





  /*  this.location = { lat:this.m.latitude, lng: this.m.longitude }
    this.map.setCenter(this.location);
    this.map.setZoom(18);

    this. marker = new google.maps.Marker({
      position: new google.maps.LatLng( this.m.latitude,this.m.longitude),
      map: this.map,
      icon: '../../assets/images/icons8-marqueur-40.png'
    }); */




      /*  google.maps.event.addListener(this.map, 'click', function(event) {
          placeMarker(this.map, event.latLng);
        });

        function placeMarker(map, location) {
          var marker = new google.maps.Marker({
            position: location,
            map: map
          });
          var infowindow = new google.maps.InfoWindow({
            content: 'Latitude: ' + location.lat() +
            '<br>Longitude: ' + location.lng()
          });

          infowindow.open(map,marker);

          console.log('latitude: ' + location.lat());
          console.log('longitude: ' + location.lng());
        } */

        //let watch = this.geolocation.watchPosition({maximumAge: 8000, timeout: 60000, enableHighAccuracy: true});
        //let current_loc= { lat: position.coords.latitude, lng: position.coords.longitude }

        this.geolocation.getCurrentPosition({maximumAge: 8000, timeout: 30000, enableHighAccuracy: true})
        .then((position) => {

          var selectedMode = document.getElementById("mode");

            let dur;
            let dist;
            var map=this.map;
            var marker=this.place_marker;
            var mark;
            let m=this.m;


            let curr_loc =  new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            let loc = new google.maps.LatLng(this.m.latitude,this.m.longitude);

           var directionsService = new google.maps.DirectionsService();
            var directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(this.map);

              directionsService.route({
                origin: curr_loc,
                destination: loc,
                travelMode: google.maps.TravelMode.DRIVING
              }, function(response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                  directionsRenderer.setDirections(response);
                  console.log(JSON.stringify(response));

                  dist = response.routes[0].legs[0].distance.text;
                  console.log(dist);

                  dur = response.routes[0].legs[0].duration.text;
                  console.log(dur);

                  mark=response.routes[0].legs[0].end_address;

                  console.log(response.routes[0].legs[0].steps[0]);

                  var infowindow = new google.maps.InfoWindow({
                    content: 'Destination: ' + mark +
                     '<br> Distance=  ' + dist +
                    '<br> Duration=  '+ dur + '<br>'
                  });
                  infowindow.open(map,marker);

                }

                 else {
                  window.alert('Directions request failed due to ' + status);
                }

               });

              var lastUpdateTime,
                minFrequency = 10*1000,
                watchOptions = {
                  timeout : 30*30*1000,
                  maximumAge: 0,
                  enableHighAccuracy: true
                };

            function on_success(position){
              var markerr

                var now = new Date();
                if(lastUpdateTime && now.getTime() - lastUpdateTime.getTime() <
                 minFrequency){
                  console.log("Ignoring position update");

                return;
              }
              lastUpdateTime = now;

              if (marker != null) {
                marker.setMap(null);
            }

                marker = new google.maps.Marker({
                position: new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
                map: map,
                title: 'My location',

              });


              var directionsService = new google.maps.DirectionsService();
            //var directionsRenderer = new google.maps.DirectionsRenderer();
            //directionsRenderer.setMap(this.map);

              directionsService.route({
                origin: new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
                destination: new google.maps.LatLng(m.latitude,m.longitude),
                travelMode: google.maps.TravelMode.DRIVING
              }, function(response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                  //directionsRenderer.setDirections(response);
                  //console.log(JSON.stringify(response));

                  dist = response.routes[0].legs[0].distance.text;
                  console.log(dist);

                  dur = response.routes[0].legs[0].duration.text;
                  console.log(dur);

                  mark=response.routes[0].legs[0].end_address;

                  console.log(response.routes[0].legs[0].steps[0]);

                  var infowindow = new google.maps.InfoWindow({
                    content: 'Destination: ' + mark +
                     '<br> Distance=  ' + dist +
                    '<br> Duration=  '+ dur + '<br>'
                  });
                  infowindow.open(map,marker);

                }

                 else {
                  window.alert('Directions request failed due to ' + status);
                }

               });


            }
            function on_error(){
              alert('err');
            }
            navigator.geolocation.watchPosition(on_success,on_error,watchOptions);


         // });

            });

          /*  watch.subscribe((position) => {
              setTimeout(()=>{
              //this.showTrackingPosition(position);
              //console.log(JSON.stringify(position));
              alert('lat:' + position.coords.latitude + ' lng: ' + position.coords.longitude);
            }, 60000);

            }); */




  }

  searchPlacesPredictions(query: string){
    let env = this;

    if(query !== "")
    {
      env.GoogleMapsService.getPlacePredictions(query).subscribe(
        places_predictions => {
          env.map_model.search_places_predictions = places_predictions;
        },
        e => {
          console.log('onError: %s', e);
        },
        () => {
          console.log('onCompleted');
        }
      );
    }else{
      env.map_model.search_places_predictions = [];
    }
  }

  setOrigin(location: google.maps.LatLng){
    let env = this;

    // Clean map
    env.map_model.cleanMap();

    // Set the origin for later directions
    env.map_model.directions_origin.location = location;

    env.map_model.addPlaceToMap(location, '#00e9d5');

    // With this result we should find restaurants (*places) arround this location and then show them in the map

    // Now we are able to search *restaurants near this location
    env.GoogleMapsService.getPlacesNearby(location).subscribe(
      nearby_places => {
        // Create a location bound to center the map based on the results
        let bound = new google.maps.LatLngBounds();

        for (var i = 0; i < nearby_places.length; i++) {
          bound.extend(nearby_places[i].geometry.location);
          env.map_model.addNearbyPlace(nearby_places[i]);
        }

        // Select first place to give a hint to the user about how this works
        env.choosePlace(env.map_model.nearby_places[0]);

        // To fit map with places
        env.map_model.map.fitBounds(bound);
      },
      e => {
        console.log('onError: %s', e);
      },
      () => {
        console.log('onCompleted');
      }
    );
  }

  selectSearchResult(place: google.maps.places.AutocompletePrediction){
    let env = this;

    env.map_model.search_query = place.description;
    env.map_model.search_places_predictions = [];

    // We need to get the location from this place. Let's geocode this place!
    env.GoogleMapsService.geocodePlace(place.place_id).subscribe(
      place_location => {
        env.setOrigin(place_location);
      },
      e => {
        console.log('onError: %s', e);
      },
      () => {
        console.log('onCompleted');
      }
    );
  }

  searchBox(i){

    let map = this.map;
    let env = this;
    let loc;
    let adr

    env.map_model.search_query = i;
    env.map_model.search_places_predictions = [];

    var directionsService = new google.maps.DirectionsService();
    var request = {
      origin: i,
      destination: i,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {

        console.log(JSON.stringify(result));
        loc = { lat: result.routes[0].legs[0].end_location.lat(), lng: result.routes[0].legs[0].end_location.lng() };
        adr = result.routes[0].legs[0].end_address;
      }

      map.setCenter(loc);
      map.setZoom(18);
      var marker = new google.maps.Marker({
        position: loc,
        map: map,
        icon: '../../assets/images/icons8-marqueur-40.png'
      });
      var infowindow = new google.maps.InfoWindow({
        content: i
      });
      infowindow.open(map,marker);
    });
  }


  clearSearch(){
    let env = this;
    this.keyboard.close();
    // Clean map
    env.map_model.cleanMap();

  }

/*  geolocateMe(){
    let env = this,
        _loading = env.loadingCtrl.create();

    _loading.present();

    this.geolocation.getCurrentPosition().then((position) => {
      let current_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      env.map_model.search_query = position.coords.latitude.toFixed(2) + ", " + position.coords.longitude.toFixed(2);
      env.setOrigin(current_location);
      env.map_model.using_geolocation = true;

      _loading.dismiss();
    }).catch((error) => {
      console.log('Error getting location', error);
      _loading.dismiss();
    });
  } */

  locateMe(){

      //let env = this,
      //_loading = env.loadingCtrl.create();
      //_loading.present();


      this.geolocation.getCurrentPosition({maximumAge: 8000, timeout: 3000, enableHighAccuracy: true}).then((position) => {

        console.log(JSON.stringify(position));
        alert(JSON.stringify(position));


        this.latitude=position.coords.latitude;
        this.longitude=position.coords.longitude;

        this.data = 'Latitude:' + position.coords.latitude + ',Longitude:' + position.coords.longitude ;
        console.log(this.data);

        //this. current_location = new google.maps.LatLng(this.latitude, this.longitude);
        this. current_location= { lat: position.coords.latitude, lng: position.coords.longitude }
        this.map.setCenter(this.current_location);
        this.map.setZoom(18);
        //this.userMarker.setPosition(this.current_location)

        var marker = new google.maps.Marker({
          position: this.current_location,
          map: this.map,
          title: 'My location',
          icon: '../../assets/images/icons8-marqueur-40 (1).png'
        });

      /*  this.map.addListener('center_changed', function() {
          // 3 seconds after the center of the map has changed, pan back to the
          // marker.
          window.setTimeout(function() {
            this.map.panTo(marker.getPosition());
          }, 3000);
        }); */

        marker.addListener('click', function() {
          this.map.setZoom(16);
          this.map.setCenter(marker.getPosition());
        });
        var infowindow = new google.maps.InfoWindow({
          content: 'My location:<br> Latitude: ' + this.latitude +
          '<br>Longitude: ' + this.longitude
        });
        infowindow.open(this.map,marker);


        //this.mapOptions = {
          //center: this.current_location,
          //zoom: 14,
          //mapTypeId: google.maps.MapTypeId.ROADMAP
        //}
        //
      }).catch((error) => {
        console.log(error);
      });

    }

    getDirections(){

      let dur;
      let dist;
      var map=this.map;
      var marker=this.marker;
      var mark;

      let curr_loc = new google.maps.LatLng(this.latitude,this.longitude);
      let loc = new google.maps.LatLng(this.m.latitude,this.m.longitude);

     var directionsService = new google.maps.DirectionsService();
      var directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(this.map);

        directionsService.route({
          origin: curr_loc,
          destination: loc,
          travelMode: google.maps.TravelMode.DRIVING
        }, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);
            console.log(JSON.stringify(response));

            dist = response.routes[0].legs[0].distance.text;
            console.log(dist);

            dur = response.routes[0].legs[0].duration.text;
            console.log(dur);

            mark=response.routes[0].legs[0].end_address;

            console.log(response.routes[0].legs[0].steps[0]);

            var infowindow = new google.maps.InfoWindow({
              content: 'Destination: ' + mark +
               '<br> Distance=  ' + dist +
              '<br> Duration=  '+ dur + '<br>'
            });
            infowindow.open(map,marker);

          }
           else {
            window.alert('Directions request failed due to ' + status);
          }

        });


        //let d=dist
        //let d1=dur


     /*  var request = {
        origin: this.current_location,
        destination: loc,
        travelMode: google.maps.TravelMode.DRIVING
      };

        directionsService.route(request, (result, status) =>{
          if (status == google.maps.DirectionsStatus.OK) {
            console.log(JSON.stringify(result));
            directionsRenderer.setDirections(result);
          }
          else console.log("err");
        })

        this.map.setCenter(loc);
        this.map.setZoom(12); */


    }

  locateMe1(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        //this.data = 'Latitude:' + position.coords.latitude + 'Longitude:' + position.coords.longitude ;
      console.log(position.coords.latitude + ' ' + position.coords.longitude);

      //this. current_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        //this.infoWindow.setPosition(pos);
        //this.infoWindow.setContent('Location found.');
        //this.infoWindow.open(this.map);
        //this.map.setCenter(pos);
      })
  }
}

  getLocation(){
    var ref;
    let watch = this.geolocation.watchPosition();
    watch.subscribe((position)=>{
      var gps = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

      let markerOptions: google.maps.MarkerOptions = {
        position: this.current_location,
        title: 'my position'

      }




      //this.map.addMarker(markerOptions);
      //this.map.refreshLayout();

  /*    if(ref.marker==null){
        ref.marker=new google.maps.Marker({
          position:gps,
          map:ref.map,
          title:'my position'

        })
      }
      else{
          ref.marker.setPosition(gps);
      }
      ref.map.panTo(gps);
      ref.latitude=position.coords.latitude.toString();
      ref.latitude=position.coords.longitude.toString();
      ref.timestamp = ( new Date(position.timestamp)).toString();  */

    })
  }


  choosePlace(place: MapPlace){
    let env = this;

    // Check if the place is not already selected
    if(!place.selected)
    {
      // De-select previous places
      env.map_model.deselectPlaces();
      // Select current place
      place.select();

      // Get both route directions and distance between the two locations
      let directions_observable = env.GoogleMapsService
            .getDirections(env.map_model.directions_origin.location, place.location),
          distance_observable = env.GoogleMapsService
            .getDistanceMatrix(env.map_model.directions_origin.location, place.location);


      Observable.forkJoin(directions_observable, distance_observable).subscribe(
        data => {
          let directions = data[0],
              distance = data[1].rows[0].elements[0].distance.text,
              duration = data[1].rows[0].elements[0].duration.text;

          env.map_model.directions_display.setDirections(directions);

          if(env.toast){
            env.toast.dismiss();
          }

          env.toast = this.toastCtrl.create({
                message: 'That\'s '+distance+' away and will take '+duration,
                duration: 2000
              });
          env.toast.present();
        },
        e => {
          console.log('onError: %s', e);
        },
        () => {
          console.log('onCompleted');
        }
      );
    }
  }


}
