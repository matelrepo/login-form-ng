import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {User} from '../config/user';
import {ANONYMOUS_USER} from './auth.service';
import {Contract} from '.././config/contract';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {RxStompService} from '@stomp/ng2-stompjs';
import {rxStompConfig} from '../config/rxStompConfig';
import { IMessage } from '@stomp/stompjs';
import {distinctUntilChanged, startWith, filter, windowToggle, flatMap, tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  // contracts = new BehaviorSubject([]);
  // contracts$: Observable<Contract[]> = this.contracts.asObservable();

  pace = 0;

   pauseSubj$: Subject<boolean> = new Subject();
   pause$: Observable<boolean> = this.pauseSubj$.pipe(
    startWith(false),
    distinctUntilChanged()
  );

   ons$ = this.pause$.pipe(filter(v => v));
   offs$ = this.pause$.pipe(filter(v => !v));

   result$ = this.rxStompService.watch('/get/live', rxStompConfig.connectHeaders).pipe(
     tap(x => {
       this.pace = this.pace + 1;
     }),
    windowToggle(
      this.offs$,
      () => this.ons$
    ),
    flatMap(x => x)
  );

  constructor(private http: HttpClient, private rxStompService: RxStompService) {}

  getContracts() {
    return this.http.get<Contract[]>('http://localhost:8080/contracts');
  }

  // helpers
  turnPause(value, delay) {
    setTimeout(() => {
      this.pauseSubj$.next(value);
    }, delay);
  }

  // getLiveCandles(): Observable<IMessage> {
  //   return this.rxStompService.watch('/get/live', rxStompConfig.connectHeaders).pipe();
  // }
}
