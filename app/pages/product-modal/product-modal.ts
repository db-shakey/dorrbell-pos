import {Component, OnInit, Input} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';
import {CartService} from '../../shared/cart.service';
import {DataService} from '../../shared/data.service';

import {FirebaseObjectObservable, AngularFire} from 'angularfire2';
import { Observable } from 'rxjs/Rx';
import {ImageCacheDirective, DefaultImage} from '../../shared/image-cache.directive';

@Component({
  templateUrl: 'build/pages/product-modal/product-modal.html',
  directives: [ImageCacheDirective, DefaultImage]
})
export class ProductModal implements OnInit{
  product: any;
  variants: any[];
  variantIds;
  quantity: number;

  constructor(private _navParams: NavParams, private dataService: DataService, private af: AngularFire, private cartService: CartService, private viewCtrl: ViewController) {


    // this.variantIds = {};
    // this.product.Variants__r.records.forEach(variant => {
    //   this.variantIds[variant.Id] = variant;
    // });
  }

  addToCart(){
    this.cartService.addItemToCart(this.product, this.quantity);
    this.viewCtrl.dismiss();
  }

  ngOnInit(){
    this.product = this._navParams.get("product");
    this.quantity = 1;
    // this.dataService.getVariantsForProduct(this.product.Id).subscribe(variants => this.variants = variants);
  }
}
