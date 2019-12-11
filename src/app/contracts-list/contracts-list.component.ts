import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../service/data.service';
import {Subscription} from 'rxjs';
import {GeneratorState} from '../config/generatorState';
import {Contract} from '../config/contract';

@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.css']
})
export class ContractsListComponent implements OnInit, OnDestroy {
  // contracts$
  contracts: Contract[] =[]
  generatorsState: Map<number, GeneratorState> = new Map<number, GeneratorState>()
  marketDataSub: Subscription
  contractSub: Subscription
  currentIndex: number =5

  constructor(private data: DataService) { }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.key =='ArrowRight') {
      this.currentIndex = this.currentIndex + 1;
      this.data.activeContract.next(this.contracts[this.currentIndex])
    }else if(event.key =='ArrowLeft'){
      this.currentIndex = this.currentIndex - 1;
      this.data.activeContract.next(this.contracts[this.currentIndex])
    }

  }

  ngOnInit() {
    this.contractSub = this.data.getContracts().subscribe( contracts => {
      this.contracts = contracts
      console.log(contracts)
    })

    this.marketDataSub =  this.data.getLivePrices()
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

  addClass(event){
    event.target.className = event.target.className.replace('myClass', '');
  }

  onClick(contract: Contract, i: number){
    this.data.activeContract.next(contract)
    this.currentIndex = i
  }

  ngOnDestroy() {
    this.marketDataSub.unsubscribe();
  }

}
