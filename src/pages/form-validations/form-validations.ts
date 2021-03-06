import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NavController,NavParams } from 'ionic-angular';

import { UsernameValidator } from '../../components/validators/username.validator';
import { PasswordValidator } from '../../components/validators/password.validator';
import { PhoneValidator } from '../../components/validators/phone.validator';

import { Country } from './form-validations.model';

import emailMask from 'text-mask-addons/dist/emailMask';
import { ProfileModel } from '../profile/profile.model';
import { ProfilePage } from '../profile/profile';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestoreDocument,AngularFirestore } from 'angularfire2/firestore';
import { NativeStorage } from '@ionic-native/native-storage';
import { SettingsPage } from '../settings/settings';

@Component({
  selector: 'form-validations-page',
  templateUrl: 'form-validations.html'
})

export class FormValidationsPage {

  validations_form: FormGroup;
  matching_passwords_group: FormGroup;
  country_phone_group: FormGroup;

  emailMask = emailMask;

  countries: Array<Country>;
  genders: Array<string>;
  user;
  password:FormGroup;
  ref;
  items;
  data1;
  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public angularFireDatabase :AngularFireDatabase,
    public nativeStorage: NativeStorage

    ) {

    this.user=this.navParams.get('text');

    this.nativeStorage.getItem('userr')
    .then(
      data1 => this.data1=data1.password,
      error => console.error(error)
    );


    this.ref = this.angularFireDatabase.database.ref('/ionic4-4bddd');

    this.angularFireDatabase.list('/ionic4-4bddd').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key,...action.payload.val() }));
    }).subscribe((data) => {
      this.items=data;

      console.log(this.items);
      });



    this.password = new FormGroup({
      c_pwd:new FormControl(this.data1, Validators.required),
      n_pwd: new FormControl(this.user, Validators.required),
      conf_pwd: new FormControl('', Validators.required),

    });


  }

  UpdatePwd(){

    let formData;
    formData=this.password.value;

    if(formData.n_pwd==formData.conf_pwd && formData.c_pwd==this.data1){

    this.angularFireDatabase.list('/ionic4-4bddd').update(this.user,{
      password:formData.n_pwd

    })
    this.navCtrl.push(SettingsPage);
  }

  else alert('Incorrect Password!')

  }

  ionViewWillLoad() {
    this.countries = [
      new Country('UY', 'Uruguay'),
      new Country('US', 'United States'),
      new Country('AR', 'Argentina')
    ];

    this.genders = [
      "Male",
      "Female"
    ];

    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirm_password: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });

    let country = new FormControl(this.countries[0], Validators.required);
    let phone = new FormControl('', Validators.compose([
      Validators.required,
      PhoneValidator.validCountryPhone(country)
    ]));
    this.country_phone_group = new FormGroup({
      country: country,
      phone: phone
    });

    this.validations_form = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        UsernameValidator.validUsername,
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        Validators.required
      ])),
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      gender: new FormControl(this.genders[0], Validators.required),
      country_phone: this.country_phone_group,
      matching_passwords: this.matching_passwords_group,
      terms: new FormControl(true, Validators.pattern('true'))
    });
  }

  validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'lastname': [
      { type: 'required', message: 'Last name is required.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'phone': [
      { type: 'required', message: 'Phone is required.' },
      { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'Password mismatch' }
    ],
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions.' }
    ],
  };

  onSubmit(values){
    console.log(values);
  }
  goToProfile(){
    this.navCtrl.push(ProfilePage);
  }
}
