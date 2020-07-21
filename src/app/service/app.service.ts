import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Chart} from '../domain/chart';
import {HttpClient} from '@angular/common/http';

export const  INIT_CHART = {id: '1', width: 300, height: 150};

@Injectable({
  providedIn: 'root'
})
export class AppService {
  dst = 'http://localhost:8080';
  //dst = 'https://matel.io:8443'
  chart = new BehaviorSubject<Chart>(INIT_CHART);
  chart$: Observable<Chart> = this.chart.asObservable();
  displayChart = true;
  // displaySaveContract = false;
  // displayExpirationReport = false;
  // displayDailyStocksReport = false;
  sendEmail = true;

  constructor(private http: HttpClient) { }

  notifyChartResize(chart: Chart) {
    this.chart.next(chart);
  }


  sendEmailTest() {
    console.log('send email test');
    return this.http.post<boolean>(this.dst + '/send-email', false);
  }

  activateEmail() {
    return this.http.post<boolean>(this.dst + '/activate-email', this.sendEmail);
  }
}
