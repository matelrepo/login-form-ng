import { Injectable } from '@angular/core';
import {Contract} from '.././config/contract';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {RxStompService} from '@stomp/ng2-stompjs';
import {rxStompConfig} from '../config/rxStompConfig';
import {BehaviorSubject, Observable} from 'rxjs';
import { IMessage } from '@stomp/stompjs';
import {Message} from '@angular/compiler/src/i18n/i18n_ast';
import {tap, throttleTime} from 'rxjs/operators';
import {Candle} from '../config/candle';



export const DEFAULT_CONTRACT: Contract = {
  idcontract: 5,
  symbol: 'ES'
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  activeContract = new BehaviorSubject(DEFAULT_CONTRACT)
  activeContract$: Observable<Contract> = this.activeContract.asObservable()

  constructor(private http: HttpClient, private rxStompService: RxStompService) {}



  getContracts() {
    return this.http.get<Contract[]>('http://localhost:8080/contracts');
  }

  getHistoCandles(idcontract: number, freq: number) {
    return this.http.get<Candle[]>('http://localhost:8080/histo-candles/' + idcontract +'/' + freq);
  }

  getLiveTicks(idcontract: number, freq: number): Observable<IMessage>{
    return this.rxStompService.watch('/get/candle-live/' + idcontract +'/' + freq, rxStompConfig.connectHeaders)
      .pipe(throttleTime(100))
  }

  getLivePrices(): Observable<IMessage>{
    return this.rxStompService.watch('/get/prices', rxStompConfig.connectHeaders);
  }

  connect(idContract: number){
    return this.http.post<boolean>('http://localhost:8080/connect/'+ idContract, true);
  }

  disconnect(idContract: number){
    return this.http.post<boolean>('http://localhost:8080/connect/'+ idContract, false);
  }

  getNotifications(): Observable<IMessage>{
    return this.rxStompService.watch('/get/notifications', rxStompConfig.connectHeaders)
  }

  updateContract(contract: Contract, factor: string) {
    return this.http.post<HttpResponse<any>>('http://localhost:8080/contract/' + contract.idcontract + '/' + factor, contract, {observe: 'response'})
  }

  }
