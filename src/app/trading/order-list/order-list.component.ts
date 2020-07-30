import {Component, OnDestroy, OnInit} from '@angular/core';
import {Order} from "../../domain/order";
import {DataService} from "../../service/data.service";
import {TradingService} from "../../service/trading.service";
import {Subscription} from "rxjs";
import {Contract} from "../../domain/contract";
import {AppService} from "../../service/app.service";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, OnDestroy {
  page: number = 1;
  orders: Order[] = []
  displayPortfolioGlobal = true;
  private liveOrdersSubscription = new Subscription()
  private activeContractSubscription = new Subscription()
  private activeContract: Contract

  constructor(private tradingService: TradingService,
              private data:DataService,
              private app: AppService) { }

  subscribeHisto(){
    if(this.displayPortfolioGlobal){
      this.subscribeHistoOrders(1)
    }else {
      this.subscribeHistoOrders(this.activeContract.idcontract)
    }
  }

  ngOnInit() {
    this.app.portfolioChange_.subscribe(()=> {
      this.displayPortfolioGlobal = !this.displayPortfolioGlobal
      this.subscribeHisto()
    })

    this.activeContractSubscription = this.data.activeContract$
      .subscribe(contract => {
        this.activeContract = contract;
        this.subscribeHisto()
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
