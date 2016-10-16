import {Component, OnInit, Pipe, PipeTransform, Directive} from '@angular/core';
import {NavController, Platform, ModalController, LoadingController, ActionSheetController, ViewController} from 'ionic-angular';
import {ScreenOrientation, BarcodeScanner, Toast} from 'ionic-native';
import {CartService} from '../../shared/cart.service';
import {DataService} from '../../shared/data.service';
import {ImageCacheDirective, DefaultImage} from '../../shared/image-cache.directive';

// import * as firebase from 'firebase';

import {ProductModal} from '../product-modal/product-modal';
import {CheckoutModal} from '../checkout-modal/checkout';
import {CustomerModal} from '../customer-modal/customer';

@Component({
  templateUrl: 'build/pages/home/home.html',
  directives: [DefaultImage, ImageCacheDirective]
})
export class HomePage implements OnInit{
  categories: any[];
  objCat : any;

  constructor(private navCtrl: NavController, private platform:Platform,
              private dataService: DataService, private modalCtrl: ModalController,
              private loadingCtrl: LoadingController, private cartService: CartService, private actionSheetCtrl: ActionSheetController) {}

  showProductModal(product){
    let modal = this.modalCtrl.create(ProductModal, {"product" : product}, {enableBackdropDismiss : false});
    modal.present();
  }

  showCheckoutModal(){
    let modal = this.modalCtrl.create(CheckoutModal);
    modal.present();
  }

  ngOnInit(){
    let loader = this.loadingCtrl.create({  content: "Please wait...",duration: 3000});
    loader.present();
    this.dataService.getProductCatalog().subscribe(catalog => {
      this.objCat = catalog;
      this.categories = Object.keys(this.objCat);
      loader.dismiss();
    })
  }

  scanBarcode(){
    BarcodeScanner.scan().then(barcodeData => {
      let barcodeText = barcodeData.text;
      if(!barcodeData.cancelled){
        let loader = this.loadingCtrl.create({  content: "Looking up barcode...",duration: 10000});
        loader.present();
        this.dataService.getProductByBarcode(barcodeText).subscribe(products => {
          loader.dismiss();
          if(products && products.length > 0){
            this.showProductModal(products[0]);
          }
          else
            Toast.show("Couldn't match product for barcode " + barcodeText, '5000', 'center').subscribe(a => {console.log('toast success');}, b=>{console.log('toast fail ' + b);});
        })
      }
    })
  }

  showContactModal(){
    let modal = this.modalCtrl.create(CustomerModal);
    modal.present();
  }

  presentPopover(event){
    let actionSheet = this.actionSheetCtrl.create({
     title: 'Customer Options',
     buttons: [
       {
         text: 'View Order History',
         handler: () => {
           console.log('Archive clicked');
         }
       },
       {
         text: 'Switch Customer',
         role: 'destructive',
         handler: () => {
           setTimeout(() => {
             this.showContactModal();
           }, 500);
         }
       },{
         text: 'Cancel',
         role: 'cancel'
       }
     ]
   });
   actionSheet.present();
  }
}
