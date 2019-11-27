import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Contract} from '../config/contract';
import {DataService} from '../service/data.service';

@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.css']
})
export class ContractDetailsComponent implements OnInit {

  myForm: FormGroup;
  activeContract: Contract;

  constructor(private fb: FormBuilder, private dataService: DataService) { }

  ngOnInit() {
    this.dataService.activeContract$.subscribe( contract => {
      this.activeContract = contract
      this.initForm();
    })
  }

  initForm() {
    this.myForm = this.fb.group({
      symbol: this.activeContract.symbol,
      expiration: this.activeContract.expiration,
      firstNotice: this.activeContract.firstNotice,
      adjustment: '0'
    });
  }

  onSubmit(){
    this.activeContract.expiration = this.myForm.value.expiration
    this.activeContract.firstNotice = this.myForm.value.firstNotice
    this.dataService.updateContract(this.activeContract, this.myForm.value.adjustment).subscribe()
  }

}
