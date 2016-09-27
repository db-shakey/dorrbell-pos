import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataService {

  public user: any;
  public store: any;

  private obsStore: FirebaseObjectObservable<any>;

  constructor(public af: AngularFire, private userService: UserService) {

  }

  getUser(){
    return Observable.create(observer => {
      if(this.user)
        observer.next(this.user);
      else
        this.userService.login('ret@dorrbell.com', 'dorrbell123').then(()=> {
          this.userService.getUser().subscribe(user => {
            this.user = user;
            observer.next(this.user);
          });
        });
    })
  }

  getStore(){
    return Observable.create(observer => {
      if(this.store)
        observer.next(this.store);
      else
        this.getUser().subscribe(user => {
          this.af.database.object('retailers/' + user.contact.Store__c).subscribe(store => {
            this.store = store;
            observer.next(this.store);
          })
        });
    });
  }

  getVariantsForProduct(productId){
    return Observable.create(observer => {
      this.getUser().subscribe(user => {
        this.af.database.list('/retailers/' + user.contact.Store__c + '/products', {query : {orderByChild : 'Parent_Product__c', equalTo : productId}}).subscribe(products => {
          observer.next(products);
        });
      });
    })
  }

  getProductByBarcode(barcodeData: string){
    return this.getUser().flatMap(user => this.af.database.list('/retailers/' + user.contact.Store__c + '/products', {query : {orderByChild: 'Barcode__c', equalTo: barcodeData}}));
  }

  getProductCatalog(){
    return Observable.create(observer => {
      this.getUser().subscribe(user => {
        this.af.database.list('/retailers/' + user.contact.Store__c + '/products', {query : {orderByChild : 'RecordType/DeveloperName', equalTo : 'Product'}}).subscribe(products => {
          let objCat: any = {};
          products.forEach(product => {
            if(product.Image__r){
              if(!objCat[product.Family])
                objCat[product.Family] = {Name : product.Family, Image : product.Image__r.Image_Thumb__c, items : [product]}
              else
                objCat[product.Family].items.push(product);
            }
          });
          observer.next(objCat);
        })
      })
    })
  }
}
