import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RxStompService} from "@stomp/ng2-stompjs";
import {Observable} from "rxjs";
import {IMessage} from "@stomp/stompjs";
import {rxStompConfig} from "../config/rxStompConfig";
import {Order} from "../domain/order";
import {PortfolioState} from "../domain/portfolioState";

@Injectable({
  providedIn: 'root'
})
export class TradingService {
 dst = 'http://localhost:8080';
  // dst = 'https://matel.io:8443'

  constructor(private http: HttpClient, private rxStompService: RxStompService) { }

  getLivePortfolio(idcontract: number): Observable<IMessage> {
    return this.rxStompService.watch('/get/portfolio-live/'+idcontract, rxStompConfig.connectHeaders);
  }

  getLiveOrders(idcontract: number): Observable<IMessage> {
    return this.rxStompService.watch('/get/orders-live/'+idcontract, rxStompConfig.connectHeaders);
  }

  getHistoPortfolio(idcontract: number) {
    return this.http.get<PortfolioState>(this.dst + '/portfolio-histo/'+idcontract );
  }

  getHistoOrders(idcontract: number) {
    return this.http.get<Order[]>(this.dst + '/orders-histo/'+idcontract );
  }

  sendOrder(order: Order) {
    return this.http.post<Order>(this.dst + '/trader/order', order);
  }


}
