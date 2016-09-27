import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {NavParams, ViewController, AlertController} from 'ionic-angular';
import {CartService} from '../../shared/cart.service';
import {DataService} from '../../shared/data.service';
import { CardIO } from 'ionic-native';
import { SignaturePad } from 'angular2-signaturepad';

@Component({
  templateUrl: 'build/pages/checkout-modal/checkout.html',
  directives: [SignaturePad]
})

export class CheckoutModal implements OnInit{

  private tenderAmount: number;
  private cardDisplay: string;
  private step: string = 'payment';
  private doneSigning: boolean = false;
  private loadingText: string;

  private signaturePadOptions: Object = {
    'canvasWidth': .7 * window.innerWidth,
    'canvasHeight': 200
  }
  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  constructor(private _navParams: NavParams, private dataService: DataService, private cartService: CartService, private viewCtrl: ViewController, private alertCtrl: AlertController) {}

  ngOnInit(){}

  scanCard(){
    CardIO.canScan()
    .then(
      (res: boolean) => {
        if(res){
          let options = {
            requireExpiry: false,
            requireCCV: false,
            requirePostalCode: false,
            supressManual : true,
            keepApplicationTheme : true,
            suppressConfirmation : true,
            useCardIOLogo : true,
            hideCardIOLogo : true
          };
          CardIO.scan(options).then(data => {
            this.cartService.cardInfo = data;
            this.cardDisplay = data.redactedCardNumber;
          });
        }
      }
    );
  }

  authorizeTransaction(){
    this.setLoading('Authorizing your transaction...');
    setTimeout(() => {
      this.step = 'tip';
    }, 4000)
  }

  setLoading(message){
    this.loadingText = message;
    this.step = 'loading';
  }

  customTip(){
    let prompt = this.alertCtrl.create({
     title: 'Custom Tip Amount',
     message: "Enter a dollar amount to apply as a tip to this order.",
     inputs: [
       {
         name: 'tip',
         placeholder: '$0.00'
       },
     ],
     buttons: [
       {
         text: 'Cancel'
       },
       {
         text: 'Save',
         handler: data => {
           this.cartService.setTipAmount(data.tip);
           this.step = 'sign';
         }
       }
     ]
   });
   prompt.present();
  }

  setTip(amt){
    this.cartService.tip = amt;
    this.step = 'sign';
  }

  clearSig(){
    this.signaturePad.clear();
    this.doneSigning = false;
  }

  submitOrder(){
    this.setLoading('Placing Order...');
    this.cartService.submitOrder().subscribe(res => {
      this.step = 'complete';
    })
  }

  newCart(){
    this.cartService.clear();
    this.viewCtrl.dismiss();
  }
}
