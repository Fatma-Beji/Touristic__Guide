import { Component } from '@angular/core';
import { NavController, LoadingController, Item, NavParams } from 'ionic-angular';
import { VillePage } from '../ville/ville';
import { CategFormPage } from '../categ-form/categ-form';
import { List1Model } from '../ville/ville-model';
import { List1Page } from '../list-1/list-1';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestoreDocument,AngularFirestore } from 'angularfire2/firestore';
import { WalkthroughPage } from '../walkthrough/walkthrough';


@Component({
  selector: 'grid-page',
  templateUrl: 'grid.html'
})
export class GridPage {

  items
  ref:any;
  m;
  rootPage: any = WalkthroughPage;

  constructor(
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public angularFireDatabase:AngularFireDatabase,
    public angularFirestore: AngularFirestore,
    public navParams: NavParams
    ) {

    this.ref = this.angularFireDatabase.database.ref('/pays');

    this.angularFireDatabase.list('/pays').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key,...action.payload.val() }));
    }).subscribe((data) => {
      this.items=data;

      console.log(this.items);


      },
       (err)=>{ console.log( err) });

       this.m=this.navParams.get('text');
       console.log(this.m);


  }

  go(){
    this.nav.push(VillePage,{text:this.m});
  }
  goToAddPlace(){
    this.nav.push(CategFormPage);
  }

  goToCountries(){
    this.nav.push(VillePage);
  }

  goToCategories(){
    this.nav.push(GridPage);
  }

  goToPlaces(){
    this.nav.push(List1Page);
  }


  logout() {

    // navigate to the new page if it is not the current page
    this.nav.setRoot(this.rootPage);

  }
}
