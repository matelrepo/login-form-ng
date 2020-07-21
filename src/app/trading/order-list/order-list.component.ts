import { Component, OnInit } from '@angular/core';
import {Order} from "../../domain/order";
import {DataService} from "../../service/data.service";
import {TradingService} from "../../service/trading.service";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = []
  constructor(private tradingService: TradingService) { }

  ngOnInit() {
    this.tradingService.getLiveOrders().subscribe(mes=>{
      this.orders = JSON.parse(mes.body);
      console.log(this.orders)
    })
  }

}
