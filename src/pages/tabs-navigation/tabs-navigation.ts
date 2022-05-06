import { Component } from '@angular/core';
import { NavController, LoadingController, Button, NavParams } from 'ionic-angular';
import { ListingPage } from '../listing/listing';
import { ProfilePage } from '../profile/profile';
import { NotificationsPage } from '../notifications/notifications';
import { FormValidationsPage } from '../form-validations/form-validations';
import { SettingsPage } from '../settings/settings';

@Component({
  selector: 'tabs-navigation',
  templateUrl: 'tabs-navigation.html'
})
export class TabsNavigationPage {
  tab1Root: any;
  tab2Root: any;
  tab3Root: any;
  params;

  constructor() {
    this.tab1Root = ListingPage;
    this.tab2Root = SettingsPage;
    this.tab3Root = NotificationsPage;
  }
}
