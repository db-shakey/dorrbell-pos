import { Injectable } from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/share';

// const endpoint: string = 'https://dorrbell-test.herokuapp.com';
// const endpoint: string = 'http://localhost:5000';
const endpoint: string = 'https://dorrbell.herokuapp.com';

@Injectable()
export class HerokuService {
  public loading: boolean = false;
  constructor(private http: Http) {}

  createAuthorizationHeader() {
    let headers = new Headers();
    headers.append('authorization', 'Basic Z14vbjcyayxOdUpnM0pfXw==');
    return headers;
  }

  getEndpoint(){
    return endpoint;
  }

  get(url) {
    this.loading = true;

    let postResult = this.http.get(endpoint + url, {headers : this.createAuthorizationHeader()}).share();

    postResult.subscribe(res => {
      this.loading = false;
    }, err => {
      this.loading = false;
    });
    return postResult;
  }

  post(url, data) {
    this.loading = true;
    let postResult = this.http.post(endpoint + url, data, {headers : this.createAuthorizationHeader()}).share();

    postResult.subscribe(res => {
      this.loading = false;
    }, err => {
      this.loading = false;
    });

    return postResult;

  }
}
