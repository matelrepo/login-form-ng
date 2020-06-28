import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../service/data.service';
import {GeneratorState} from '../config/generatorState';
import {Observable, Subscription} from 'rxjs';
import {Contract} from '../config/contract';
import {Candle} from '../config/candle';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnInit, OnDestroy {
  generatorStateSub: Subscription;
  generatorStateHistoSub: Subscription;
  generatorState: GeneratorState;
  contract: Contract;
  activeCandle: Candle;
  date: Date;
  hideMe = false;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {

    setInterval(() => {
      this.date = new Date();
    }, 1000);

    this.dataService.activeCandle$.subscribe(candle => {
      this.activeCandle = candle;
    });

    this.dataService.activeContract$.subscribe(contract => {
      if (this.generatorState !== undefined) {
      //  console.log("Unsubscribe data for " + this.contract.idcontract)
        this.generatorStateSub.unsubscribe();
      }
      this.contract = contract;
      this.activeCandle = null;


      this.generatorStateHistoSub = this.dataService.getHistoQuote(this.contract.idcontract).subscribe( quote => {
        this.generatorState = quote;
        console.log(quote)
        this.generatorStateHistoSub.unsubscribe();
      });

      this.generatorStateSub = this.dataService.getLiveQuote(this.contract.idcontract)
        .subscribe((message) => {
          this.generatorState = JSON.parse(message.body);
        //  console.log(this.generatorState.ask + " " + this.generatorState.bid);
        });
    });

  }

  hideButton(){
    console.log('coucou');
    this.hideMe = !this.hideMe;
  }

  ngOnDestroy() {
    this.generatorStateSub.unsubscribe();
  }

}
