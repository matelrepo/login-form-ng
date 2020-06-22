import {Injectable, OnDestroy} from '@angular/core';
import {Contract} from '.././config/contract';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {RxStompService} from '@stomp/ng2-stompjs';
import {rxStompConfig} from '../config/rxStompConfig';
import {BehaviorSubject, Observable} from 'rxjs';
import {IMessage} from '@stomp/stompjs';
import {switchMap, tap, throttleTime} from 'rxjs/operators';
import {Candle} from '../config/candle';
import {GeneratorState} from '../config/generatorState';
import {ProcessorState} from '../config/processorState';
import {GlobalSettings} from '../config/globalSettings';



export const DEFAULT_CONTRACT: Contract = {
  idcontract: 5,
  symbol: 'ES'
};

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnDestroy {
  // dst  = 'http://37.59.39.230:8080'
  dst = 'http://localhost:8080';
//  dst = 'http://91.121.83.101:8080'

  activeContract = new BehaviorSubject(DEFAULT_CONTRACT);
  activeContract$: Observable<Contract> = this.activeContract.asObservable();

  activeCandle = new BehaviorSubject(null);
  activeCandle$: Observable<Candle> = this.activeCandle.asObservable();

  constructor(private http: HttpClient, private rxStompService: RxStompService) {
  }

  ngOnDestroy(): void {
    this.rxStompService.deactivate();
  }

  getContracts(category: string, filter: string) {
    if (category === 'DAILY') {
      return this.http.get<Contract[]>(this.dst + '/contracts/dailycon/' + category + '/' + filter);
    } else {
      return this.http.get<Contract[]>(this.dst + '/contracts/live/' + category + '/' + filter);
    }
  }

  getExpirationReport(){
    return this.http.get<Contract[]>(this.dst + '/expiration-report');
  }

  reqContractDetails(contract: Contract){
    return this.http.post<Contract>(this.dst + '/contract-details', contract);
  }

  getContractDetails(): Observable<IMessage> {
    return this.rxStompService.watch('/get/contract-details', rxStompConfig.connectHeaders);
  }

  // getTickerCrawl() {
  //   return this.http.get<Macro[]>(this.dst + '/ticker-crawl');
  // }

  getGlobalSettings(idcontract: number) {
    return this.http.get<Map<number, GlobalSettings>>(this.dst + '/global-settings/' + idcontract);
  }

  setGlobalSettings(setting: GlobalSettings){
    return this.http.post<GlobalSettings>(this.dst + '/update-global-settings', setting);
  }

  getHistoCandles(idcontract: number, code: string, freq: number) {
    return this.http.get<Candle[]>(this.dst + '/histo-candles/' + idcontract + '/' + code + '/' + freq);
  }

  getlogsPocessor(idcontract: number, freq: number) {
    return this.http.get<ProcessorState[]>(this.dst + '/log-processor/' + idcontract + '/' + freq);
  }

  getLiveTicks(idcontract: number, freq: number): Observable<IMessage> {
    return this.rxStompService.watch('/get/candle-live/' + idcontract + '/' + freq, rxStompConfig.connectHeaders)
      .pipe(throttleTime(100));
  }

  getLiveQuote(idcontract: number): Observable<IMessage> {
    return this.rxStompService.watch('/get/quote/' + idcontract, rxStompConfig.connectHeaders);
  }

  getPortfolioLive(): Observable<IMessage> {
    return this.rxStompService.watch('/get/portfolio-update', rxStompConfig.connectHeaders);
  }

  getPorfolio() {
    return this.http.get(this.dst + '/portfolio', {responseType: 'text'});
  }

  getHistoQuote(idcontract: number) {
    return this.http.get<GeneratorState>(this.dst + '/quote-histo/' + idcontract);
  }

  getLivePrices(): Observable<IMessage> {
    return this.rxStompService.watch('/get/prices', rxStompConfig.connectHeaders);
  }

  connect(idContract: number) {
    console.log('connect');
    return this.http.post<boolean>(this.dst + '/connect/' + idContract, true);
  }

  connectAll() {
    return this.http.post<boolean>(this.dst + '/connect-all', false);
  }

  disconnectAll() {
    return this.http.post<boolean>(this.dst + '/disconnect-all/true', false);
  }


  disconnect(idContract: number) {
    console.log('disconnect');
    return this.http.post<boolean>(this.dst + '/connect/' + idContract, false);
  }

  getNotifications(): Observable<IMessage> {
    return this.rxStompService.watch('/get/notifications', rxStompConfig.connectHeaders);
  }

  updateContract(contract: Contract, factor: string) {
    return this.http.post<HttpResponse<any>>(this.dst + '/save-contract/' + factor, contract, {observe: 'response'});
  }

}
