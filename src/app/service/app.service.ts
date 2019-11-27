import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Chart} from '../config/chart';
import {User} from '../config/user';

export const  INIT_CHART = {id: "1", width: 300, height: 150}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  chart = new BehaviorSubject<Chart>(INIT_CHART)
  chart$ : Observable<Chart> = this.chart.asObservable();

  constructor() { }

  notifyChartResize(chart: Chart){
    console.log(chart)
    this.chart.next(chart)
  }



}
