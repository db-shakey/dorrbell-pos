import {Component, OnInit, Input} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';
import {CartService} from '../../shared/cart.service';
import {DataService} from '../../shared/data.service';

import {FirebaseObjectObservable, AngularFire} from 'angularfire2';
import { Observable } from 'rxjs/Rx';

@Component({
  templateUrl: 'build/pages/product-modal/product-modal.html'
})
export class ProductModal implements OnInit{
  product: any;
  variants: any[];
  variantIds;

  constructor(private _navParams: NavParams, private dataService: DataService, private af: AngularFire, private cartService: CartService, private viewCtrl: ViewController) {
    this.product = _navParams.get("product");

    this.variantIds = {};
    this.product.Variants__r.records.forEach(variant => {
      this.variantIds[variant.Id] = variant;
    });
  }

  addToCart(variant){
    this.cartService.addItemToCart(variant);
    this.viewCtrl.dismiss();
  }

  ngOnInit(){
    this.dataService.getVariantsForProduct(this.product.Id).subscribe(variants => this.variants = variants);
  }
}
