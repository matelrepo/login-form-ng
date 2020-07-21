import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Order} from '../../domain/order';
import {DataService} from "../../service/data.service";
import {Contract} from "../../domain/contract";
import {TradingService} from "../../service/trading.service";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  myForm: FormGroup;
  order: Order = new Order()
  private activeContract: Contract;
  constructor(private fb: FormBuilder, private data: DataService, private tradingService: TradingService) { }

  ngOnInit() {

    this.data.activeContract$.subscribe(contract => {
      this.activeContract = contract;
      console.log(contract)
    });

    this.myForm = this.fb.group({
      quantity: 1,
      frequency: "1",
      price: 66,
      orderType: "LMT"
    });
  }

  onClickBuy(){
  }

  onClickSell(){
  }

  onSubmit(){
    this.order.quantity = this.myForm.value.quantity;
    this.order.idcontract = this.activeContract.idcontract
    this.order.frequency = this.myForm.value.frequency
    this.order.orderType = this.myForm.value.orderType
    this.order.price = this.myForm.value.price;
    this.tradingService.sendOrder(this.order).subscribe()
  }

}
