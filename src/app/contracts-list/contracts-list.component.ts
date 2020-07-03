import {AfterViewInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../service/data.service';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {GeneratorState} from '../config/generatorState';
import {Contract} from '../config/contract';
import {AppService} from '../service/app.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.css']
})
export class ContractsListComponent implements OnInit, OnDestroy, AfterViewInit {
  // contracts$
  contracts: Contract[] = [];
  generatorsState: Map<number, GeneratorState> = new Map<number, GeneratorState>();
  marketDataSub: Subscription;
  contractSub: Subscription;
  currentIndex = 5;
  selectedValue  = 'MAIN';
  inputValue = 'a';
   input;

  constructor(private data: DataService, public appService: AppService) { }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.currentIndex = this.currentIndex + 1;
      this.data.activeContract.next(this.contracts[this.currentIndex]);
    } else if (event.key === 'ArrowLeft') {
      this.currentIndex = this.currentIndex - 1;
      this.data.activeContract.next(this.contracts[this.currentIndex]);
    }

  }

  selectionChanged(item) {
    const filter = item === 'DAILY' ? this.inputValue : 'a'
    if ( filter.length > 0) {
      this.selectedValue = item;
      if (this.contractSub !== undefined) { this.contractSub.unsubscribe(); }
      this.contractSub = this.data.getContracts(this.selectedValue, filter).subscribe( contracts => {
      this.contracts = contracts;
    });
    }
  }

  ngAfterViewInit() {
     const input: any = document.getElementById('search');
     const search$ = fromEvent<any>(input, 'keyup')
      .pipe(tap(() => this.selectionChanged(this.selectedValue)));
     search$.subscribe(ev => {
      this.inputValue = input.value;
    });
  }

  ngOnInit() {
    this.contractSub = this.data.getContracts(this.selectedValue, this.inputValue).subscribe( contracts => {
      this.contracts = contracts;
    });
    this.marketDataSub =  this.data.getLivePrices()
      .subscribe((message) => {
        Object.keys(JSON.parse(message.body)).forEach(key => {
          this.generatorsState.set(JSON.parse(message.body)[key].idcontract, JSON.parse(message.body)[key]);
        });
      });


  }


  marketData(idcontract: number) {
    console.log(this.generatorsState.get(idcontract).marketDataStatus);
    if (this.generatorsState.get(idcontract).marketDataStatus >= 1) {
        this.generatorsState.get(idcontract).marketDataStatus = 0;
        this.data.disconnect(idcontract).subscribe(() => {
      });
    } else {
        this.generatorsState.get(idcontract).marketDataStatus = 1;
        this.data.connect(idcontract).subscribe(() => {
      });
    }
  }

  addClass(event) {
    event.target.className = event.target.className.replace('myClass', '');
  }

  onClick(contract: Contract, i: number) {
    this.data.activeContract.next(contract);
    this.currentIndex = i;
  }

  ngOnDestroy() {
    this.marketDataSub.unsubscribe();
    this.contractSub.unsubscribe();
  }

}
