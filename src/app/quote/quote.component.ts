import {Component, OnInit} from '@angular/core';
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
export class QuoteComponent implements OnInit {
  generatorStateSub: Subscription;
  generatorState: GeneratorState;
  contract: Contract;
  activeCandle: Candle;
  date: Date;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {

    setInterval(() => {         //replaced function() by ()=>
      this.date = new Date();
    }, 1000);

    this.dataService.activeCandle$.subscribe(candle => {
      this.activeCandle = candle;
    });

    this.dataService.activeContract$.subscribe(contract => {
      this.contract = contract;
      this.activeCandle = null;
      if (this.generatorState != undefined) {
        this.generatorStateSub.unsubscribe();
      }

      // this.dataService.getHistoQuote(this.contract.idcontract).subscribe( quote=> this.generatorState = quote)

      this.generatorStateSub = this.dataService.getLiveQuote(this.contract.idcontract)
        .subscribe((message) => {
          this.generatorState = JSON.parse(message.body);
        });
    });

    // this.generatorStateSub = this.dataService.getLiveQuote(this.contract.idcontract)
    //   .subscribe((message) => {
    //       this.generatorState = JSON.parse(message.body)
    //   });

  }

}
