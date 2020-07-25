import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AppService {
  dst = 'http://localhost:8080';
  //dst = 'https://matel.io:8443'

  portfolioChange_ = new Subject()
  sendEmail = true;
  numCappedHistoricalCandles = 1000;
  numCappedEvents = 20;


  constructor(private http: HttpClient) { }

  portfolioChange(){
    this.portfolioChange_.next()
  }

  sendEmailTest() {
    console.log('send email test');
    return this.http.post<boolean>(this.dst + '/send-email', false);
  }

  activateEmail() {
    return this.http.post<boolean>(this.dst + '/activate-email', this.sendEmail);
  }
}
