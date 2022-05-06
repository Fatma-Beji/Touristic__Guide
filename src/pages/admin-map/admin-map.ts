  import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
  import { NavController, LoadingController, ToastController, Icon } from 'ionic-angular';
  import { Geolocation } from '@ionic-native/geolocation';
  import { Keyboard } from '@ionic-native/keyboard';

  import { Observable } from 'rxjs/Observable';

  import { GoogleMap } from "../../components/google-map/google-map";
  import { GoogleMapsServiceAdmin } from "./map-admin.service";
  import { MapsModel, MapPlace } from './admin-map.model';
  import { GeolocationPage } from '../geolocation/geolocation';

  //google place -- google direction -- geolocation

  @Component({
    selector: 'maps-page',
    templateUrl: 'admin-map.html'
  })

  export class AdminMapPage implements OnInit {
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



    constructor(
      public nav: NavController,
      public loadingCtrl: LoadingController,
      public toastCtrl: ToastController,
      public GoogleMapsService: GoogleMapsServiceAdmin,
      public geolocation: Geolocation,
      public keyboard: Keyboard
    ) {

    }


    ngOnInit() {
      let _loading = this.loadingCtrl.create();
      _loading.present();

      this._GoogleMap.$mapReady.subscribe(map => {
        this.map_model.init(map);
        _loading.dismiss();
      });

      //this.map = new google.maps.Map(document.getElementById("map"), this.mapOptions);

      this.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 33.9, lng: 10.6},
        zoom: 6,

      });


          var latlng
          var lat
          var lng

        // google.maps.event.addListener(this.map, 'click', function(event) {
         /* var infowindoww = new google.maps.InfoWindow({
            content: 'Latitude: ' + location.lat() +
            '<br/>Longitude: ' + location.lng()
          });*/

          var marker = new google.maps.Marker({
            position: new google.maps.LatLng( 33,10),
            map: this.map,
           // icon: new google.maps.MarkerImage('../../assets/images/maps/place-1.jpg'),
           //draggable: true
          });

          //let markersArray = [];
          //markersArray.push(marker);

         // marker.addListener('click', function() {
            //infowindoww.open(this.map, marker);
          //});

          //lat=location.lat();
         // lng=location.lng();
          //console.log('latitude: ' + location.lat());
          //console.log('longitude: ' + location.lng());

         // });

          function placeMarker(map, location) {


          }

      //this.infoWindow = new google.maps.InfoWindow;


    /*     var myLatlng = {lat:33.9, lng: 10.6};


          // Create the initial InfoWindow.
          var infoWindow = new google.maps.InfoWindow(
              {content: 'Click the map to get Lat/Lng!', position: myLatlng});
          infoWindow.open(this.map);

          // Configure the click listener.
          this.map.addListener('click', function(mapsMouseEvent) {
            // Close the current InfoWindow.
            infoWindow.close();

            // Create a new InfoWindow.
            infoWindow = new google.maps.InfoWindow({position: mapsMouseEvent.latLng});
            infoWindow.setContent(mapsMouseEvent.latLng.toString());


            console.log(infoWindow);

            infoWindow.open(this.map);

          }); */



       /*   var geocoder = new google.maps.Geocoder;

            google.maps.event.addListener(this.map,'click', function() {
              geocodeLatLng(geocoder,this.map, this.infowindoww);
            });

      function geocodeLatLng(geocoder, map, infowindow) {
        //var input = latlng;
        //var latlngStr = input.split(" ",2);
        var latlng = {lat: lat, lng: lng};
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              map.setZoom(11);
              var marker = new google.maps.Marker({
                position: latlng,
                map: map
              });
              infowindow.setContent(results[0].formatted_address);
              infowindow.open(map, marker);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      }  */


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
          console.log(e);
        },
        () => {
          console.log('onCompleted');
        }
      );
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
        this.map.setZoom(8);
        //this.userMarker.setPosition(this.current_location)

        var marker = new google.maps.Marker({
          position: this.current_location,
          map: this.map,
          title: 'My location'
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
          content: 'Latitude: ' + this.latitude +
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

      //this.getLocation();
    }

    locateMe1(){

        navigator.geolocation.getCurrentPosition(function(position) {
          alert(JSON.stringify(position));
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };


        //console.log((position.coords.latitude) + ' ' + (position.coords.longitude));


        //this. current_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        //this.map.setCenter(this.current_location);
        //this.map.setZoom(8);

        //this. current_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

          this.infoWindow.setPosition(pos);
          this.infoWindow.setContent('Location found.');
          this.infoWindow.open(this.map);
          this.map.setCenter(pos);
        })

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

