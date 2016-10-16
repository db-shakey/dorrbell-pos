import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {Storage, SqlStorage} from 'ionic-angular';

import {HerokuService} from './heroku.service';
import 'rxjs/add/operator/share';

@Injectable()
export class CartService implements OnInit {
  public customer: any;
  public items: any;
  public tip: number = 0;
  public cardInfo: any;
  private storage;

  constructor(private herokuService: HerokuService) {
    this.items = [];
    this.storage = new Storage(SqlStorage);
    this.storage.get('cart').then(items => {
      if(items)
        this.items = JSON.parse(items);
    });
  }

  ngOnInit(){}

  addItemToCart(product, quantity){
    product.quantity = quantity;
    this.items.push(product);
    return this.storage.set('cart', JSON.stringify(this.items));
  }

  removeItemFromCart(index){
    this.items.splice(index, 1);
    return this.storage.set('cart', JSON.stringify(this.items));
  }

  getTipAmount(tip:number){
    if(!tip)
      tip = this.tip;

    return this.getSubtotal() * (tip / 100);
  }

  setTipAmount(tip:number){
    this.tip = (tip / this.getSubtotal()) * 100;
  }

  getSubtotal(){
    let sum: number = 0;
    this.items.forEach(product => {
      sum += (product.Price * product.quantity);
    })
    return sum;
  }

  getTotal(){
    let sum: number = 0;
    this.items.forEach(product => {
      sum += (product.Price * product.quantity);
    })
    return sum * ((this.tip / 100) + 1);
  }
  clear(){
    this.items = [];
    this.tip = null;
    this.storage.set('cart', null);
    this.cardInfo = null;
  }

  submitOrder(){
    let orderPost = this.herokuService.post('/orders', {
      items : this.items,
      card : this.cardInfo,
      customer : this.customer
    });
    return orderPost;
  }

}
