import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Order} from '../config/order';
import {DataService} from "../service/data.service";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  myForm: FormGroup;
  order: Order = new Order()
  constructor(private fb: FormBuilder, private data: DataService) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      quantity: 1,
      frequency: "1",
      price: 0,
      orderType: "LMT"
    });
  }

  onClickBuy(){
    this.order.way = "BUY"
  }

  onClickSell(){
    this.order.way= "SELL"
  }

  onSubmit(){
    this.order.quantity = this.myForm.value.quantity;
    console.log(this.myForm.value.frequency)
    this.order.frequency = this.myForm.value.frequency;
    this.order.orderType = this.myForm.value.orderType;
    this.order.price = this.myForm.value.price;
    console.log(this.order)
    this.data.sendOrder(this.order).subscribe()
  }

}
