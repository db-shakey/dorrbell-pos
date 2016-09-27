import {Component} from '@angular/core';
import {Platform, ionicBootstrap, ModalController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {UserService} from './shared/user.service';
import {HerokuService} from './shared/heroku.service';
import {CartService} from './shared/cart.service';
import {DataService} from './shared/data.service';
import {ImageCacheDirective} from './shared/image-cache.directive';
import {CheckoutModal} from './pages/checkout-modal/checkout';
import {FIREBASE_PROVIDERS, defaultFirebase, AngularFire} from 'angularfire2';

import 'intl';
import 'intl/locale-data/jsonp/en';

declare var ImgCache: any;

const firebaseConfig = {
  apiKey: "AIzaSyCbzQTM1kMvD5EsdXSU-moUJFaXgHX0Kr8",
  authDomain: "dorrbell-test.firebaseapp.com",
  databaseURL: "https://dorrbell-test.firebaseio.com",
  storageBucket: "dorrbell-test.appspot.com",
}
@Component({
  templateUrl : 'build/app.html',
})
export class MyApp{

  private rootPage: any;

  constructor(private platform: Platform, private cartService: CartService, private modalCtrl: ModalController) {

    this.rootPage = HomePage;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      ImgCache.init(() => {
        console.log('ImgCache init: success!');

        // from within this function you're now able to call other ImgCache methods
        // or you can wait for the ImgCacheReady event

      }, () => {
        console.log('ImgCache init: error! Check the log for errors');
      });

    });
  }

  showCheckoutModal(){
    let modal = this.modalCtrl.create(CheckoutModal);
    modal.present();
  }

}

ionicBootstrap(MyApp, [FIREBASE_PROVIDERS, defaultFirebase(firebaseConfig), UserService, HerokuService, CartService, DataService, ImageCacheDirective], {prodMode: true});
