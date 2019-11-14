import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../service/data.service';
import {Subscription} from 'rxjs';
import {GeneratorState} from '../config/generatorState';

@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.css']
})
export class ContractsListComponent implements OnInit, OnDestroy {
  contracts$;
  generatorsState: Map<number, GeneratorState> = new Map<number, GeneratorState>();
  subscriptionMarketData: Subscription;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.contracts$ = this.data.getContracts()

    this.subscriptionMarketData =  this.data.getLivePrices()
      .subscribe((message) => {
        Object.keys(JSON.parse(message.body)).forEach(key => {
          this.generatorsState.set(JSON.parse(message.body)[key].idcontract, JSON.parse(message.body)[key]);
        });
      });
  }

  marketData(idcontract: number){
    this.generatorsState.get(idcontract).connected = !this.generatorsState.get(idcontract).connected;
    if(this.generatorsState.get(idcontract).connected) {
      this.data.connect(idcontract).subscribe(() => {
      })
    }else{
      this.data.disconnect(idcontract).subscribe(() => {
      })
    }
  }

  //
  //
  // on() {
  //   this.data.turnPause(true, 10);
  // }
  //
  // off() {
  //   this.data.turnPause(false, 10);
  // }

  addClass(event){
    event.target.className = event.target.className.replace('myClass', '');
  }

  ngOnDestroy() {
    this.subscriptionMarketData.unsubscribe();
  }

}
