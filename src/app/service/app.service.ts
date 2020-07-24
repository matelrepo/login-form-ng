import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  dst = 'http://localhost:8080';
  //dst = 'https://matel.io:8443'

  sendEmail = true;
  numCappedHistoricalCandles = 1000;
  numCappedEvents = 20;
  numCappedOrders = 20;


  constructor(private http: HttpClient) { }


  sendEmailTest() {
    console.log('send email test');
    return this.http.post<boolean>(this.dst + '/send-email', false);
  }

  activateEmail() {
    return this.http.post<boolean>(this.dst + '/activate-email', this.sendEmail);
  }
}
