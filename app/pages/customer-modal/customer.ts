import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {NavParams, ViewController, AlertController} from 'ionic-angular';
import {CartService} from '../../shared/cart.service';
import {DataService} from '../../shared/data.service';
import {HerokuService} from '../../shared/heroku.service';

@Component({
  templateUrl: 'build/pages/customer-modal/customer.html'
})

export class CustomerModal implements OnInit{
  private contactList: any;

  constructor(private _navParams: NavParams, private dataService: DataService, private cartService: CartService, private viewCtrl: ViewController, private herokuService: HerokuService) {}

  ngOnInit(){
    this.herokuService.get('/contacts').subscribe(response => {
      let body = response.json();
      this.contactList = body.records;
      console.log(this.contactList);
    })
  }

  setCustomer(customer){
    this.cartService.customer = customer;
    this.viewCtrl.dismiss();
  }

}
