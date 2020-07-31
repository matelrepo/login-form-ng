import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Order} from '../../domain/order';
import {DataService} from "../../service/data.service";
import {Contract} from "../../domain/contract";
import {TradingService} from "../../service/trading.service";
import {Subscription} from "rxjs";
import {GeneratorState} from "../../domain/generatorState";
import {Candle} from "../../domain/candle";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {
  myForm: FormGroup;
  order: Order = new Order()
  activeContract: Contract;

  generatorStateSub: Subscription;
  generatorStateHistoSub: Subscription;
  gstate: GeneratorState;
  c: Contract;
  candle: Candle;
  showCandle = true;
  lastPrice: number;
  priceBinding = true;


  constructor(private fb: FormBuilder, private data: DataService, private tradingService: TradingService) { }

  ngOnInit() {

    this.data.activeCandle$.subscribe(candle => {
      this.showCandle=true
      this.candle = candle;
      setTimeout(() => {
        this.showCandle = false
      }, 10000);
    });

    this.data.activeContract$.subscribe(contract => {
      this.activeContract = contract
      if (this.gstate !== undefined) {
        this.generatorStateSub.unsubscribe();
      }
      this.c = contract;

      this.candle = null;

      this.generatorStateHistoSub = this.data.getHistoQuote(this.c.idcontract).subscribe(quote => {
        this.gstate = quote;
        this.generatorStateHistoSub.unsubscribe();
      });

      this.generatorStateSub = this.data.getLiveQuote(this.c.idcontract)
        .subscribe((message) => {
          this.gstate = JSON.parse(message.body)
          if(this.priceBinding) {
            this.lastPrice = this.gstate.lastPrice;
            this.myForm.value.price = this.lastPrice;
          }
        });
    });

    this.myForm = this.fb.group({
      quantity: 1,
      frequency: "1",
      price: 0,
      orderType: "MKT"});
  }

  onSubmit(value){
    this.order.quantity = value.quantity;
    this.order.idcontract = this.activeContract.idcontract
    this.order.freq = value.frequency
    this.order.orderType = value.orderType
    this.order.auxPrice = value.price;
    this.order.manual = true;
    console.log(this.order)
    this.tradingService.sendOrder(this.order).subscribe()
  }

  deactivatePriceBinding(ev){
    this.priceBinding = false;
  }

  ngOnDestroy() {
    this.generatorStateSub.unsubscribe();
  }

}
