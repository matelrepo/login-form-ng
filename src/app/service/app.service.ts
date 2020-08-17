import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from "rxjs";
import {IMessage} from "@stomp/stompjs";
import {rxStompConfig} from "../config/rxStompConfig";
import {RxStompService} from "@stomp/ng2-stompjs";
import {Messenger} from "../domain/messenger";


@Injectable({
  providedIn: 'root'
})
export class AppService {
  dst = 'http://localhost:8080';
 // dst = 'https://matel.io:8443'

  portfolioChange_ = new Subject()
  sendEmail = true;
  numCappedHistoricalCandles = 1000;
  numCappedEvents = 20;


  constructor(private http: HttpClient, private rxStompService: RxStompService) { }

  portfolioChange(){
    this.portfolioChange_.next()
  }

  getHistoricalLogs(){
    return this.http.get<Messenger[]>(this.dst + '/historical-logs');
  }

    getLogs(): Observable<IMessage> {
      return this.rxStompService.watch('/get/logs', rxStompConfig.connectHeaders);
    }

  sendEmailTest() {
    return this.http.post<boolean>(this.dst + '/send-email', false);
  }

  activateEmail() {
    return this.http.post<boolean>(this.dst + '/activate-email', this.sendEmail);
  }
}
