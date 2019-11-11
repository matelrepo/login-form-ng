import { Injectable } from '@angular/core';
import {Contract} from '.././config/contract';
import {HttpClient} from '@angular/common/http';
import {RxStompService} from '@stomp/ng2-stompjs';
import {rxStompConfig} from '../config/rxStompConfig';
import {BehaviorSubject, Observable} from 'rxjs';
import { IMessage } from '@stomp/stompjs';



export const DEFAULT_CONTRACT: Contract = {
  id: 5,
  symbol: 'ES'
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private activeContract = new BehaviorSubject(DEFAULT_CONTRACT);
  activeContract$: Observable<Contract> = this.activeContract.asObservable();

  constructor(private http: HttpClient, private rxStompService: RxStompService) {}

  getContracts() {
    return this.http.get<Contract[]>('http://localhost:8080/contracts');
  }

  getLiveTicks(idcontract: number): Observable<IMessage>{
    return this.rxStompService.watch('/get/tick-live/' + idcontract, rxStompConfig.connectHeaders);
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
}
