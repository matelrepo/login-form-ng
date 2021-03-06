import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Contract} from '../../domain/contract';
import {DataService} from '../../service/data.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.css']
})
export class ContractDetailsComponent implements OnInit, OnDestroy {

  myForm: FormGroup;
  activeContract: Contract;
  quoteSub: Subscription;
  activeContractSub: Subscription;
  lastPrice = 0;

  constructor(private fb: FormBuilder, private dataService: DataService) { }

  ngOnInit() {
   this.activeContractSub =  this.dataService.activeContract$.subscribe( contract => {
      this.activeContract = contract;
      this.initForm();
      this.quoteSub = this.dataService.getHistoQuote(this.activeContract.idcontract).subscribe( state => {
        this.lastPrice =  state.lastPrice;

      });
    });
  }

  ngOnDestroy(): void {
    this.activeContractSub.unsubscribe();
    this.quoteSub.unsubscribe();

  }

  initForm() {
    this.myForm = this.fb.group({
      idcontract: this.activeContract.idcontract,
      title: this.activeContract.title,
      secType: this.activeContract.secType,
      exchange: this.activeContract.exchange,
      currency: this.activeContract.currency,
      symbol: this.activeContract.symbol,
      tickSize: this.activeContract.tickSize,
      rounding: this.activeContract.rounding,
      multiplier: this.activeContract.multiplier,
      expiration: this.activeContract.expiration,
      firstNotice: this.activeContract.firstNotice,
      active: this.activeContract.active,
      flowType: this.activeContract.flowType,
      fusion: this.activeContract.fusion,
      category: this.activeContract.category,
      oldPrice: this.lastPrice,
      newPrice: '0',
      adjustment: '0'
    });
  }

  onSubmit() {
    this.activeContract.idcontract = this.myForm.value.idcontract;
    this.activeContract.title = this.myForm.value.title;
    this.activeContract.secType = this.myForm.value.secType;
    this.activeContract.exchange = this.myForm.value.exchange;
    this.activeContract.currency = this.myForm.value.currency;
    this.activeContract.symbol = this.myForm.value.symbol;
    this.activeContract.tickSize = this.myForm.value.tickSize;
    this.activeContract.rounding = this.myForm.value.rounding;
    this.activeContract.multiplier = this.myForm.value.multiplier;
    this.activeContract.expiration = this.myForm.value.expiration;
    this.activeContract.firstNotice = this.myForm.value.firstNotice;
    this.activeContract.active = this.myForm.value.active;
    this.activeContract.flowType = this.myForm.value.flowType;
    this.activeContract.fusion = this.myForm.value.fusion;
    this.activeContract.category = this.myForm.value.category;
    this.dataService.updateContract(this.activeContract, this.myForm.value.adjustment).subscribe();
  }

}
