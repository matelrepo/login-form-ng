import {Component, OnDestroy, OnInit} from '@angular/core';
import {Contract} from '../config/contract';
import {DataService} from '../service/data.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.css']
})
export class ContractsListComponent implements OnInit, OnDestroy {
  contracts$;
  prices = new Map();
  subscriptionPrice: Subscription;

  ngOnDestroy() {
    this.subscriptionPrice.unsubscribe();
  }

  constructor(private data: DataService) { }

  ngOnInit() {
    this.contracts$ = this.data.getContracts();
    this.subscriptionPrice =  this.data
      .result$
      .subscribe((message) => {
        this.prices.set( JSON.parse(message.body).idcontract, JSON.parse(message.body).close);
        // console.log(this.prices);
      });
  }



  on() {
    this.data.turnPause(true, 10);
  }

  off() {
    this.data.turnPause(false, 10);

  }

}
