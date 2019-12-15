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
import {Macro} from '../config/macro';
import {GeneratorState} from '../config/generatorState';
import {ProcessorState} from '../config/processorState';



export const DEFAULT_CONTRACT: Contract = {
  idcontract: 5,
  symbol: 'ES'
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
  //dst  = 'http://37.59.39.230:8080'
  dst  = 'http://localhost:8080'
  activeContract = new BehaviorSubject(DEFAULT_CONTRACT)
  activeContract$: Observable<Contract> = this.activeContract.asObservable()

  activeCandle = new BehaviorSubject(null)
  activeCandle$: Observable<Candle> = this.activeCandle.asObservable()

  constructor(private http: HttpClient, private rxStompService: RxStompService) {}



  getContracts(category: string) {
    return this.http.get<Contract[]>(this.dst + '/contracts/live/' + category);
  }

  getTickerCrawl() {
    return this.http.get<Macro[]>(this.dst + '/ticker-crawl');
  }

  getHistoCandles(idcontract: number, freq: number) {
    return this.http.get<Candle[]>(this.dst + '/histo-candles/' + idcontract +'/' + freq);
  }

  getlogsPocessor(idcontract: number, freq: number) {
    return this.http.get<ProcessorState[]>(this.dst + '/log-processor/' + idcontract +'/' + freq);
  }

  getLiveTicks(idcontract: number, freq: number): Observable<IMessage>{
    return this.rxStompService.watch('/get/candle-live/' + idcontract +'/' + freq, rxStompConfig.connectHeaders)
      .pipe(throttleTime(100))
  }

  getLiveQuote(idcontract: number): Observable<IMessage>{
    return this.rxStompService.watch('/get/quote/'+idcontract, rxStompConfig.connectHeaders);
  }

  getHistoQuote(idcontract: number) {
    return this.http.get<GeneratorState>(this.dst + '/quote-histo/' + idcontract);
  }

  getLivePrices(): Observable<IMessage>{
    return this.rxStompService.watch('/get/prices', rxStompConfig.connectHeaders);
  }

  connect(idContract: number){
    return this.http.post<boolean>(this.dst + '/connect/'+ idContract, true);
  }

  disconnect(idContract: number){
    return this.http.post<boolean>(this.dst + '/connect/'+ idContract, false);
  }

  getNotifications(): Observable<IMessage>{
    return this.rxStompService.watch('/get/notifications', rxStompConfig.connectHeaders)
  }

  updateContract(contract: Contract, factor: string) {
    return this.http.post<HttpResponse<any>>(this.dst + '/contract/' + contract.idcontract + '/' + factor, contract, {observe: 'response'})
  }

  }
