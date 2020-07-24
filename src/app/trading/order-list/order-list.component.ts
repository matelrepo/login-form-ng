import {Component, OnDestroy, OnInit} from '@angular/core';
import {Order} from "../../domain/order";
import {DataService} from "../../service/data.service";
import {TradingService} from "../../service/trading.service";
import {Subscription} from "rxjs";
import {Contract} from "../../domain/contract";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders: Order[] = []
  private liveOrdersSubscription = new Subscription()
  private activeContractSubscription = new Subscription()
  private activeContract: Contract

  constructor(private tradingService: TradingService,
              private data:DataService) { }

  ngOnInit() {

    this.activeContractSubscription = this.data.activeContract$
      .subscribe(contract => {
        this.activeContract = contract;
        this.subscribeHistoOrders(contract.idcontract)
      });
  }

  subscribeHistoOrders(idcontract:number){
    this.tradingService.getHistoOrders(idcontract).subscribe(
      o=> this.orders =o,
        err=>{},
      ()=>this.subscribeLiveOrders(idcontract))
  }

  subscribeLiveOrders(idcontract: number){
    this.liveOrdersSubscription.unsubscribe()
    this.liveOrdersSubscription =  this.tradingService.getLiveOrders(idcontract).subscribe(mes=>{
      this.orders = JSON.parse(mes.body);
    })
  }

  ngOnDestroy() {
    this.activeContractSubscription.unsubscribe()
    this.liveOrdersSubscription.unsubscribe()
  }

}
