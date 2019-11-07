import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../config/user';
import {ANONYMOUS_USER} from './auth.service';
import {Contract} from '.././config/contract';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  contracts = new BehaviorSubject([]);
  contracts$: Observable<Contract[]> = this.contracts.asObservable();

  constructor(private http: HttpClient) { }

  getContracts() {
    return this.http.get<Contract[]>('http://localhost:8080/contracts');
  }
}
