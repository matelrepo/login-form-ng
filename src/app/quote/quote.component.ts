import { Component, OnInit } from '@angular/core';
import {DataService} from '../service/data.service';
import {GeneratorState} from '../config/generatorState';
import {Observable, Subscription} from 'rxjs';
import {Contract} from '../config/contract';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnInit {
  generatorStateSub: Subscription
  generatorState: Map<number, GeneratorState> = new Map<number, GeneratorState>()
  contract: Contract

  constructor(private dataService: DataService) { }

  ngOnInit() {

    this.dataService.activeContract$.subscribe(contract => {
      this.contract = contract
      console.log(this.contract)
    })

    this.generatorStateSub = this.dataService.getLivePrices()
      .subscribe((message) => {
        Object.keys(JSON.parse(message.body)).forEach(key => {
          this.generatorState.set(JSON.parse(message.body)[key].idcontract, JSON.parse(message.body)[key]);
        });
      });

  }

}