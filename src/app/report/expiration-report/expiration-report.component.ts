import { Component, OnInit } from '@angular/core';
import {Contract} from '../../domain/contract';
import {Subscription} from 'rxjs';
import {DataService} from '../../service/data.service';
import {AppService} from '../../service/app.service';

@Component({
  selector: 'app-expiration-report',
  templateUrl: './expiration-report.component.html',
  styleUrls: ['./expiration-report.component.css']
})
export class ExpirationReportComponent implements OnInit {
  contracts: Contract[] = []
  subContracts: Contract[] = []

  contractsDetail: Map<number, Contract[]> = new Map();
  contractSub: Subscription;

  constructor(private data: DataService, public appService: AppService) { }

  getSubContract(idcontract: number){
    // console.log(idcontract)
    // console.log(Array.from(Object.values(this.contractsDetail).filter(contracts => {
    //   console.log(contracts)
    //   contracts.idcontract == idcontract
    // })))
    return Array.from(Object.values(this.contractsDetail).filter(contract => contract.idcontract === idcontract))
  }

  ngOnInit() {
    this.data.getContractDetails().subscribe(mes=>{
      this.subContracts =  JSON.parse(mes.body)
      // console.log(this.subContracts)
     this.contractsDetail.set(this.subContracts[0].idcontract, this.subContracts)
      console.log(this.contractsDetail)
     //  console.log(this.contractsDetail)
      // con: [] = this.contractsDetail.get(14)
      // console.log(this.contractsDetail)
    })

    this.contractSub = this.data.getExpirationReport().subscribe(contracts => {
      this.contracts = contracts;
      this.contracts.forEach(con=>{
        this.data.reqContractDetails(con).subscribe()
      })
    });
  }

}
