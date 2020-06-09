import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Chart} from '../config/chart';

export const  INIT_CHART = {id: '1', width: 300, height: 150};

@Injectable({
  providedIn: 'root'
})
export class AppService {
  chart = new BehaviorSubject<Chart>(INIT_CHART);
  chart$: Observable<Chart> = this.chart.asObservable();
  displayPortfolio = true;
  displayProcessorLogs = false;
  displayChart = true;
  displaySaveContract = false;
  displayMacro = false;

  constructor() { }

  notifyChartResize(chart: Chart) {
    console.log(chart);
    this.chart.next(chart);
  }



}
