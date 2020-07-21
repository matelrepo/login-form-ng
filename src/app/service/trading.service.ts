import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RxStompService} from "@stomp/ng2-stompjs";
import {Observable} from "rxjs";
import {IMessage} from "@stomp/stompjs";
import {rxStompConfig} from "../config/rxStompConfig";
import {Order} from "../domain/order";

@Injectable({
  providedIn: 'root'
})
export class TradingService {
  dst = 'http://localhost:8080';
  // dst = 'https://matel.io:8443'

  constructor(private http: HttpClient, private rxStompService: RxStompService) { }


  getLivePortfolio(): Observable<IMessage> {
    return this.rxStompService.watch('/get/portfolio-live', rxStompConfig.connectHeaders);
  }

  getLiveOrders(): Observable<IMessage> {
    return this.rxStompService.watch('/get/orders-live', rxStompConfig.connectHeaders);
  }


  // getPortfolioLive(): Observable<IMessage> {
  //   return this.rxStompService.watch('/get/portfolio-update', rxStompConfig.connectHeaders);
  // }

  getPorfolio() {
    return this.http.get(this.dst + '/portfolio' );
  }

  getOrders() {
    return this.http.get(this.dst + '/orders' );
  }

  sendOrder(order: Order) {
    return this.http.post<Order>(this.dst + '/trader/order', order);
  }


}
