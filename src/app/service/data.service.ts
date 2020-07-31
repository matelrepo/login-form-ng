import {Injectable, OnDestroy} from '@angular/core';
import {Contract} from '../domain/contract';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {RxStompService} from '@stomp/ng2-stompjs';
import {rxStompConfig} from '../config/rxStompConfig';
import {BehaviorSubject, Observable} from 'rxjs';
import {IMessage} from '@stomp/stompjs';
import {throttleTime} from 'rxjs/operators';
import {Candle} from '../domain/candle';
import {GeneratorState} from '../domain/generatorState';
import {AppSettings} from '../domain/appSettings';
import {ProcessorState} from "../domain/processorState";



export const DEFAULT_CONTRACT: Contract = {
  idcontract: 5,
  symbol: 'ES',
  tickSize: 0.25
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
  dst = 'http://localhost:8080';
 // dst = 'https://matel.io:8443'

  activeContract = new BehaviorSubject(DEFAULT_CONTRACT);
  activeContract$: Observable<Contract> = this.activeContract.asObservable();

  activeCandle = new BehaviorSubject(null);
  activeCandle$: Observable<Candle> = this.activeCandle.asObservable();

  constructor(private http: HttpClient, private rxStompService: RxStompService) {
  }

  disconnectWebsocket(): void {
    this.rxStompService.deactivate();
    console.log('deactivated')
  }

  getContracts(category: string, filter: string) {
    if (category === 'DAILY') {
      return this.http.get<Contract[]>(this.dst + '/contracts/dailycon/' + category + '/' + filter);
    } else {
      return this.http.get<Contract[]>(this.dst + '/contracts/live/' + category + '/' + filter);
    }
  }

  getExpirationReport() {
    return this.http.get<Contract[]>(this.dst + '/expiration-report');
  }

  getHistoEvents(idcontract: number) {
    return this.http.get<ProcessorState[]>(this.dst + '/histo-events/' + idcontract);
  }

  getLiveEventsByContract(idcontract: number): Observable<IMessage> {
    return this.rxStompService.watch('/get/live-events/' +idcontract, rxStompConfig.connectHeaders);
  }

  getLiveEventsByContractByFreq(idcontract: number, freq: number): Observable<IMessage> {
    return this.rxStompService.watch('/get/live-events/' +idcontract +'/' + freq, rxStompConfig.connectHeaders);
  }

  getLiveEvents(): Observable<IMessage> {
    return this.rxStompService.watch('/get/live-events', rxStompConfig.connectHeaders);
  }



  reqContractDetails(contract: Contract) {
    return this.http.post<Contract>(this.dst + '/contract-details', contract);
  }

  reqDataBreak( check: boolean) {
    return this.http.post(this.dst + '/data-break', check);
  }

  getContractDetails(): Observable<IMessage> {
    return this.rxStompService.watch('/get/contract-details', rxStompConfig.connectHeaders);
  }

  getGlobalSettings(idcontract: number) {
    return this.http.get<Map<number, AppSettings>>(this.dst + '/global-settings/' + idcontract);
  }

  setGlobalSettings(setting: AppSettings) {
    return this.http.post<AppSettings>(this.dst + '/update-global-settings', setting);
  }

  getHistoCandles(idcontract: number, code: string, freq: number) {
    return this.http.get<Candle[]>(this.dst + '/histo-candles/' + idcontract + '/' + code + '/' + freq);
  }

  getLiveTicks(idcontract: number, freq: number): Observable<IMessage> {
    return this.rxStompService.watch('/get/candle-live/' + idcontract + '/' + freq, rxStompConfig.connectHeaders)
      .pipe(throttleTime(100));
  }

  getLiveQuote(idcontract: number): Observable<IMessage> {
    return this.rxStompService.watch('/get/quote/' + idcontract, rxStompConfig.connectHeaders);
  }

  // getPortfolioLive(): Observable<IMessage> {
  //   return this.rxStompService.watch('/get/portfolio-update', rxStompConfig.connectHeaders);
  // }
  //
  // getPorfolio() {
  //   return this.http.get(this.dst + '/portfolio', {responseType: 'text'});
  // }

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

  // getNotifications(): Observable<IMessage> {
  //   return this.rxStompService.watch('/get/notifications', rxStompConfig.connectHeaders);
  // }

  updateContract(contract: Contract, factor: string) {
    return this.http.post<HttpResponse<any>>(this.dst + '/save-contract/' + factor, contract, {observe: 'response'});
  }

}
