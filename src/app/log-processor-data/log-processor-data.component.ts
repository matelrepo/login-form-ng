import { Component, OnInit } from '@angular/core';
import {DataService} from '../service/data.service';
import {Contract} from '../config/contract';
import {ProcessorState} from '../config/processorState';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-log-processor-data',
  templateUrl: './log-processor-data.component.html',
  styleUrls: ['./log-processor-data.component.css']
})
export class LogProcessorDataComponent implements OnInit {
  contract: Contract
  logsProcessor: ProcessorState[]
  logsProcessorSub: Subscription
  constructor(private dataService: DataService) { }

  ngOnInit() {

    this.dataService.activeContract$.subscribe(contract => {
      this.contract = contract;
      if(this.logsProcessorSub != undefined)
      this.logsProcessorSub.unsubscribe()
      this.logsProcessorSub = this.dataService.getlogsPocessor(contract.idcontract,6900).subscribe(logs => {
        this.logsProcessor = logs
      })

    })
  }

}
