import { Component } from '@angular/core';
import { MenuController, SegmentButton, App, NavParams,NavController,LoadingController, Content } from 'ionic-angular';
import { FollowersPage } from '../followers/followers';
import { SettingsPage } from '../settings/settings';
import { ProfileModel } from './profile.model';
import { ProfileService } from './profile.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NativeStorage } from '@ionic-native/native-storage';
import {FacebookLoginPage} from '../facebook-login/facebook-login';
import {GoogleLoginService} from '../google-login/google-login.service';
import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestoreDocument,AngularFirestore } from 'angularfire2/firestore';



import 'rxjs/Rx';
import { timestamp } from 'rxjs/operators';

@Component({
  selector: 'profile-page',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  display: string;
  profile: ProfileModel = new ProfileModel();
  main_page: { component: any };
  items
  ref:any;
  loading: any;
  public data : any;
  placeRef:any;

  imageSource;
  imageP;


  constructor(
    public menu: MenuController,
    public navController: NavController,
    public app: App,
    public navParams: NavParams,
    public profileService: ProfileService,
    public socialSharing: SocialSharing,
    public nativeStorage: NativeStorage,
    public loadingCtrl: LoadingController,
    public angularFireDatabase:AngularFireDatabase,
    public angularFirestore: AngularFirestore,
    public googleLoginService: GoogleLoginService,
    //public facebookLoginPage: FacebookLoginPage


  ) {

    this.loading = this.loadingCtrl.create();
    this.ref = this.angularFireDatabase.database.ref('/ionic4-4bddd');

    this.angularFireDatabase.list('/ionic4-4bddd').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key,...action.payload.val() }));
    }).subscribe((data) => {
      this.items=data;

      console.log(this.items);


      },
       (err)=>{ console.log( err) });

      //(this.angularFirestore.collection<any>('/places'));


     // this.imageSource='aa';
     //this.getPhotoUrl(this.imageSource);


    this.display = "list";
    this.main_page = { component: TabsNavigationPage };
  }

  ionViewDidLoad() {
    this.profileService.getData()
      .then(data => {
        this.profile.user = data.user;
        this.profile.following = data.following;
        this.profile.followers = data.followers;
        this.profile.posts = data.posts;
      });
  }

  goToFollowersList() {
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.app.getRootNav().push(FollowersPage, {
      list: this.profile.followers
    });
  }

  goToFollowingList() {
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.app.getRootNav().push(FollowersPage, {
      list: this.profile.following
    });
  }

  goToSettings() {
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.app.getRootNav().push(SettingsPage);
  }

  onSegmentChanged(segmentButton: SegmentButton) {
    // console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    // console.log('Segment selected', segmentButton.value);
  }

  sharePost(post) {
   //this code is to use the social sharing plugin
   // message, subject, file, url
   this.socialSharing.share(post.description, post.title, post.image)
   .then(() => {
     console.log('Success!');
   })
   .catch(() => {
      console.log('Error');
   });
  }


  LogOut(){
    this.nativeStorage.getItem('logOut')
    .then(
      (data) => {
           if ( data == 'facebook_user' ) {
           // this.facebookLoginPage.doFacebookLogout();

           }
           else if(data == 'Google_user'){

           }
           else{

           }
      },
      error => console.error(error)
  )
  }
}
