import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';
import { GoogleUserModel } from './google-user.model';
//import { environment } from '../../environment/environment';
import { AngularFireDatabase  } from 'angularfire2/database';


@Injectable()
export class GoogleLoginService {

  ref:any;

  constructor(
    public http: Http,
    public nativeStorage: NativeStorage,
    public googlePlus: GooglePlus,
    public angularFireDatabase:AngularFireDatabase
  )
  {
    this.ref = this.angularFireDatabase.database.ref('/ionic4-4bddd');
  }

  trySilentLogin()
  {
    //checks if user is already signed in to the app and sign them in silently if they are.
    return new Promise<GoogleUserModel>((resolve, reject) => {
      this.googlePlus.trySilentLogin({
        'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        'webClientId': '163500899304-i06p98jba48954qqdaerie15dtpvigf5.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'offline': true
      })
      .then((user) => {
        this.setGoogleUser(user)
        .then((res) => {
          resolve(res);
        });
      }, (error) => {
        reject(error);
      });
    });
  }

  doGoogleLogin()
  {
    return new Promise<GoogleUserModel>((resolve, reject) => {
      this.googlePlus.login({
        'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        'webClientId': '163500899304-i06p98jba48954qqdaerie15dtpvigf5.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'offline': true
      })
      .then( (user) => {
        this.setGoogleUser(user)
        .then((res) => {
          resolve(res);
        });
      },  (error) => {
        reject(error);
      });
    });
  }

  doGoogleLogout()
  {
    return new Promise((resolve, reject) => {
      this.googlePlus.logout()
      .then((response) => {
        //user logged out so we will remove him from the NativeStorage
        this.nativeStorage.remove('google_user');

        resolve();
      }, (error) => {
        reject(error);
      });
    });
  }

  getGoogleUser()
  {
    return this.nativeStorage.getItem('google_user');
  }

  setGoogleUser(user: any)
  {
    return new Promise<GoogleUserModel>((resolve, reject) => {
      this.getFriendsFakeData()
      .then(data => {
        console.log(JSON.stringify(data));
        resolve(this.nativeStorage.setItem('google_user',
          {
            userId: user.userId,
            name: user.displayName,
            email: user.email,
            image: user.imageUrl,
            friends: data.friends,
            photos: data.photos
          })
        );
      });
      this.ref.push({userId:user.id,name:user.name,gender: user.gender})
    });
  }

  getFriendsFakeData(): Promise<GoogleUserModel> {
    return this.http.get('./assets/example_data/social_integrations.json')
     .toPromise()
     .then(response => response.json() as GoogleUserModel)
     .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }


}
