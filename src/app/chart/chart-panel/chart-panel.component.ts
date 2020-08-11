import {Component, OnInit} from '@angular/core';
import {DataService} from "../../service/data.service";
import {fromEvent, Subscription} from "rxjs";
import {Contract} from "../../domain/contract";
import {Candle} from "../../domain/candle";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: 'app-chart-panel',
  templateUrl: './chart-panel.component.html',
  styleUrls: ['./chart-panel.component.css']
})
export class ChartPanelComponent implements OnInit {
  freq: number = 1380
  prevFreq: number = 1380
  idcontract: number
  candle: Candle
  private activeContractSubscription: Subscription = new Subscription()
  private activeContract: Contract
  private liveDataSubscription: Subscription = new Subscription()

  constructor(private data: DataService) {
  }

  ngOnInit() {
    this.activeContractSubscription = this.data.activeContract$
      .subscribe(contract => {
        this.activeContract = contract;
        this.idcontract = this.activeContract.idcontract
        this.subscribeLive()
      });

    fromEvent(document.getElementById('contract'), 'input')
      .pipe(debounceTime(1000), distinctUntilChanged()).subscribe(v => {
        let type: string
        let symbol: string
      if((<HTMLInputElement>v.target).value.includes('@')){
        type = 'DAILY'
        symbol = (<HTMLInputElement>v.target).value.replace('@','')
      }else{
        type ='LIVE'
        symbol = (<HTMLInputElement>v.target).value
      }
        this.data.getContract(symbol, type).subscribe(c=>{
            console.log(c)
          if(c!=null)
              this.data.activeContract.next(c);
        })
    });

    fromEvent(document.getElementById('freq'), 'input')
      .pipe(debounceTime(1000), distinctUntilChanged()).subscribe(v => {
      if (!isNaN(Number((<HTMLInputElement>v.target).value))) {
        this.prevFreq = this.freq
        this.freq = Number((<HTMLInputElement>v.target).value)
        //Notify the child chart so it updates its subscription too
        this.data.activeFreq.next(this.freq)
        this.subscribeLive()
      } else {
        console.log((<HTMLInputElement>v.target).value + ' Not a Number');
      }
    });
  }

  subscribeLive() {
    this.liveDataSubscription.unsubscribe();
    this.liveDataSubscription = this.data.getLiveTicks(this.activeContract.idcontract, this.freq).subscribe(mes => {
      const candle: Candle = JSON.parse(mes.body);
      this.candle = candle
    });
  }

}
