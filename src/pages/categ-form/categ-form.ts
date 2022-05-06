import { Component } from '@angular/core';
import { NavController, SegmentButton, AlertController, Platform, normalizeURL } from 'ionic-angular';
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
import { GridPage } from '../grid/grid';



@Component({
  selector: 'form-layout-page',
  templateUrl: 'categ-form.html'
})
export class CategFormPage {
  section: string;

  post_form: any;
  event_form: FormGroup;
  card_form: FormGroup;

  categories_checkbox_open: boolean;
  categories_checkbox_result;

  selected_image: any;

  ref:any;
  imageName;


  constructor(
    public nav: NavController,
    public alertCtrl: AlertController,
    public cropService: Crop,
    public imagePicker: ImagePicker,
    public platform: Platform,
    public angularFireDatabase: AngularFireDatabase,
    public toastCtrl: ToastController
  ) {

    this.ref = this.angularFireDatabase.database.ref('/pays');

    this.section = "post";

     this.post_form = new FormGroup({

      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      servings: new FormControl(2, counterRangeValidator(10, 1)),
      time: new FormControl('01:30', Validators.required),
      temperature: new FormControl(180)
    });


   this.event_form = new FormGroup({
      title: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      from_date: new FormControl('2016-09-18', Validators.required),
      from_time: new FormControl('13:00', Validators.required),
      to_date: new FormControl('', Validators.required),
      to_time: new FormControl('', Validators.required)
    });
    this.card_form = new FormGroup({
      card_number: new FormControl('', Validators.required),
      card_holder: new FormControl('', Validators.required),
      cvc: new FormControl('', Validators.required),
      exp_date: new FormControl('', Validators.required),
      save_card: new FormControl(true, Validators.required)
    });
  }


  addPlace(){
    let formData;
    formData=this.post_form.value;
    //this.imageName=this.post_form.value.title;

    this.ref.push({
      name: formData.title,
      description: formData.description,
      //image: this.imageName

    })

    this.nav.push(GridPage,{text:this.imageName});
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



  openImagePicker1(){
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
                this.uploadImage(results[i]);}
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
      });
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



    uploadImage(imageURI){
      this.imageName=this.post_form.value.title;
      return new Promise<any>((resolve, reject) => {
        let storageRef = firebase.storage().ref();
        let imageRef = storageRef.child('imagesPlaces/'+ this.imageName +'.jpg');
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
