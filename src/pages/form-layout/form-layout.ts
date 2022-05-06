import { Component } from '@angular/core';
import { NavController, SegmentButton, AlertController, Platform, normalizeURL, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { Toast }           from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { List1Page } from '../list-1/list-1';
import { environment } from '../../environment/environment';



@Component({
  selector: 'form-layout-page',
  templateUrl: 'form-layout.html'
})
export class FormLayoutPage {
  section: string;

  post_form: any;
  event_form: FormGroup;
  card_form: FormGroup;

  categories_checkbox_open: boolean;
  categories_checkbox_result;

  selected_image: any;

  ref:any;
  ref1:any;
  imageName;
  items;
  ref2;
  items2;

  lat:any;
  lng:any;
  img:any;
  results:any;
  tab;
  m;
  event_ref;
  event_item;


  constructor(
    public nav: NavController,
    public alertCtrl: AlertController,
    public cropService: Crop,
    public imagePicker: ImagePicker,
    public platform: Platform,
    public angularFireDatabase: AngularFireDatabase,
    public toastCtrl: ToastController,
    public navParams: NavParams
  ) {

    this.ref = this.angularFireDatabase.database.ref('/places');

    this.ref1 = this.angularFireDatabase.database.ref('/countries');

    this.event_ref = this.angularFireDatabase.database.ref('/events');

    this.angularFireDatabase.list('/countries').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key,...action.payload.val() }));
    }).subscribe((data) => {
      this.items=data;

      console.log(this.items);

      },
       (err)=>{ console.log( err) });

       this.ref2 = this.angularFireDatabase.database.ref('/pays');
       this.angularFireDatabase.list('/pays').snapshotChanges().map(actions => {
         return actions.map(action => ({ key: action.key,...action.payload.val() }));
       }).subscribe((data1) => {
         this.items2=data1;
         //console.log(this.items1);
         },
          (err)=>{ console.log( err) });

          this.event_ref = this.angularFireDatabase.database.ref('/events');
          this.angularFireDatabase.list('/events').snapshotChanges().map(actions => {
            return actions.map(action => ({ key: action.key,...action.payload.val() }));
          }).subscribe((data1) => {
            this.event_item=data1;
            //console.log(this.items1);
            },
             (err)=>{ console.log( err) });


    this.m=this.navParams.get('text');
    console.log(this.m);


    this.section = "post";

     this.post_form = new FormGroup({

      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      adr: new FormControl('', Validators.required),
      country: new FormControl(this.m),
      tel: new FormControl(),
      email: new FormControl(),
      website: new FormControl(),
      day_from: new FormControl(),
      day_to: new FormControl(),
      time_from: new FormControl(),
      time_to: new FormControl(),
      category: new FormControl()


     /* from_date: new FormControl('Monday', Validators.required),
      from_time: new FormControl('13:00', Validators.required),
      to_date: new FormControl('', Validators.required),
      to_time: new FormControl('', Validators.required),


      servings: new FormControl(2, counterRangeValidator(10, 1)),
      time: new FormControl('01:30', Validators.required),
      temperature: new FormControl(180) */

    });


   this.event_form = new FormGroup({
      title: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      from_date: new FormControl(''),
      from_time: new FormControl(''),
      to_date: new FormControl(''),
      to_time: new FormControl('')
    });

    /*this.card_form = new FormGroup({
      card_number: new FormControl('', Validators.required),
      card_holder: new FormControl('', Validators.required),
      cvc: new FormControl('', Validators.required),
      exp_date: new FormControl('', Validators.required),
      save_card: new FormControl(true, Validators.required)
    }); */


  }
  addEvent(){
    let formData;
    formData=this.event_form.value;
    let formData1;
    formData1=this.post_form.value;

    this.event_ref.push({

      name: formData.title,
      location: formData.location,
      from_date: formData.from_date,
      from_time: formData.from_time,
      to_date: formData.to_date,
      to_time: formData.to_time,
      place: formData1.title,

    })


  this.nav.push(List1Page);

  }


  addPlace(){
    let results=this.results;

    for(var i=0;i<results.length;i++){
		  results[i] =  'data:image/jpeg;base64,' + results[i];
      }

   /* this.angularFireDatabase.list('/places').update('-MAAkzidmrqt283Iaplv',{
      latitude:'10.34',
      longitude:'11.34'
    })*/
    let place_db = this.angularFireDatabase;
    let ref_deb=this.ref;


    let formData;
    formData=this.post_form.value;
    this.imageName=this.post_form.value.title;

    var directionsService = new google.maps.DirectionsService();

      //var start = formData.adr;
      //var end = formData.adr;
      var request = {
        origin: formData.adr,
        destination: formData.adr,
        travelMode: google.maps.TravelMode.DRIVING
      };
      directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          //console.log(JSON.stringify(result));
          //alert(JSON.stringify(result));
          console.log(JSON.stringify(result));
          //console.log(JSON.stringify(result.routes));

          this.lat=result.routes[0].legs[0].end_location.lat();
          //alert(this.lat)
          this.lng=result.routes[0].legs[0].end_location.lng();
          //let p=result.routes[0].legs[0].end_location.lng();

          ref_deb.push({

            name: formData.title,
            description: formData.description,
            country:formData.country,
            adr:formData.adr,
            tel:formData.tel,
            email:formData.email,
            website:formData.website,
            day_from:formData.day_from,
            day_to:formData.day_to,
            time_from:formData.time_from,
            time_to:formData.time_to,
            latitude:result.routes[0].legs[0].end_location.lat(),
            longitude:result.routes[0].legs[0].end_location.lng(),
            img: results,
            category: formData.category
            //image: this.imageName

          })




        }
        else {
          alert('Location NOT FOUND! Try again');
      }

      });
      this.nav.push(List1Page,{text:this.imageName});

  }



  onSegmentChanged(segmentButton: SegmentButton) {
    // console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    // console.log('Segment selected', segmentButton.value);
  }

  createPost(){
    console.log(this.post_form.value);
  }

  createEvent(){
    console.log(this.event_form.value);
  }

  createCard(){
    console.log(this.card_form.value);
  }

  chooseCategory(){
    let alert = this.alertCtrl.create({
      cssClass: 'category-prompt'
    });
    alert.setTitle('Category');

    alert.addInput({
      type: 'checkbox',
      label: 'Alderaan',
      value: 'value1',
      checked: true
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Bespin',
      value: 'value2'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Confirm',
      handler: data => {
        console.log('Checkbox data:', data);
        this.categories_checkbox_open = false;
        this.categories_checkbox_result = data;
      }
    });
    alert.present().then(() => {
      this.categories_checkbox_open = true;
    });
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
            maximumImagesCount: 4,
            width: 100,
            height: 100,
            quality: 30
          }).then(
            (results) => {
              this.results = results;
              this.tab=results;
            /* for (var i = 0; i < results.length; i++) {
                alert(JSON.stringify(results[i]));

              }   8.1.2
                  3.20.1 */


            }, (err) => alert(err)
          );
        }
      }, (err) => {
        alert(err);
      });
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
                 },
                 error => console.error("Error cropping image", error)
               );
             }
           }, (err) => console.log(err)
         );
       }
     }
   )
  }



  openImagePicker11(){
    this.imagePicker.hasReadPermission().then(
      (result) => {
        if(result == false){
          // no callbacks required as this opens a popup which returns async
          this.imagePicker.requestReadPermission();
        }
        else if(result == true){
          this.imagePicker.getPictures({
            maximumImagesCount: 1
          }).then(
            (results) => {
              for (var i = 0; i < results.length; i++) {
                this.cropService.crop(results[i], {quality: 75}).then(
                  newImage => {
                    let image  = normalizeURL(newImage);
                    this.selected_image = image;
                  },
                )
                this.uploadImage(results[i]);
                this.img=results;
                //this.ref.push({img: results});
              }
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
      });
    }


    uploadImage(imageURI){
      this.imageName=this.post_form.value.title;
      return new Promise<any>((resolve, reject) => {
        //let storageRef = firebase.storage().ref();
        //let imageRef = storageRef.child('imagesPlaces/'+ this.imageName +'.jpg');
        let imageRef
        this.encodeImageUri(imageURI, function(image64){
          imageRef.putString(image64, 'data_url')
          .then(snapshot => {
            resolve(snapshot.downloadURL)
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



    uploadImageToFirebase(image){
      image = normalizeURL(image);

      //uploads img to firebase storage
      this.ref.uploadImage(image)
      .then(photoURL => {

        let toast = this.toastCtrl.create({
          message: 'Image was updated successfully',
          duration: 3000
        });
        toast.present();
        })
      }
}
