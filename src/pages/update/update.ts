import { Component } from '@angular/core';
import { NavController, SegmentButton, AlertController, Platform, normalizeURL,NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { Toast }           from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { List1Model } from '../list-1/list-1.model';
import { List1Page } from '../list-1/list-1';


@Component({
  selector: 'form-layout-page',
  templateUrl: 'update.html'
})

export class UpdatePage {
  section: string;

  post_form: any;
  event_form: FormGroup;
  card_form: FormGroup;

  categories_checkbox_open: boolean;
  categories_checkbox_result;

  selected_image: any;

  ref:any;
  items;
  m : any;
  ref1
  items1
  img;
  results:any;
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
    public navParams: NavParams,

  ) {

    this.ref1 = this.angularFireDatabase.database.ref('/countries');

    this.event_ref = this.angularFireDatabase.database.ref('/events');

    this.event_ref = this.angularFireDatabase.database.ref('/events');
    this.angularFireDatabase.list('/events').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key,...action.payload.val() }));
    }).subscribe((data1) => {
      this.event_item=data1;
      //console.log(this.items1);
      },
       (err)=>{ console.log( err) });



    this.angularFireDatabase.list('/countries').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key,...action.payload.val() }));
    }).subscribe((data1) => {
      this.items1=data1;

      console.log(this.items);
      console.log(this.navParams.get('text'));
      this.m=this.navParams.get('text');
      console.log(this.m.key);



      },
       (err)=>{ console.log( err) });

    this.ref = this.angularFireDatabase.database.ref('/places');

    this.section = "post";
    this.angularFireDatabase.list('/places').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key,...action.payload.val() }));
    }).subscribe((data) => {
      this.items=data;

      console.log(this.items);
      console.log(this.navParams.get('text'));
      this.m=this.navParams.get('text');
      console.log(this.m.key);



      },
       (err)=>{ console.log( err) });
      let a= this.navParams.get('text');
     this.post_form = new FormGroup({

      title: new FormControl(a.name, Validators.required),
      description: new FormControl(a.description, Validators.required),
      adr: new FormControl(a.adr, Validators.required),
      country: new FormControl(a.country,Validators.required),
      tel: new FormControl(a.tel),
      email: new FormControl(a.email),
      website: new FormControl(a.website),
      day_from: new FormControl(a.day_from),
      day_to: new FormControl(a.day_to),
      time_from: new FormControl(a.time_from),
      time_to: new FormControl(a.time_to),
      category: new FormControl(a.category)

      //servings: new FormControl(2, counterRangeValidator(10, 1)),
      //time: new FormControl('01:30', Validators.required),
      //temperature: new FormControl(180)
    });



    this.event_form = new FormGroup({
      title: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      from_date: new FormControl(''),
      from_time: new FormControl(''),
      to_date: new FormControl(''),
      to_time: new FormControl('')
    });


  }

  editEvent(){
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

  editPlaces(name,description){

    for(var i=0;i<this.results.length;i++){
		  this.results[i] =  'data:image/jpeg;base64,' + this.results[i];
      }

    //console.log(m);
    let formData;
    formData=this.post_form.value;
    console.log(formData.title);

    this.angularFireDatabase.list('/places').update(this.navParams.get('text').key,{
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
    img: this.results,
    category: formData.category
  })

    this.nav.push(List1Page);
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
        //width: int,
        //height: int,
        outputType: 1
            }).then(
              (results) => {
                this.results = results;

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
