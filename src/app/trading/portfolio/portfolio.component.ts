import {Component, OnDestroy, OnInit} from '@angular/core';
import {PortfolioState} from '../../domain/portfolioState';
import {Position} from '../../domain/position';
import {TradingService} from "../../service/trading.service";
import {DataService} from "../../service/data.service";
import {Subscription} from "rxjs";
import {Contract} from "../../domain/contract";
import {AppService} from "../../service/app.service";

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit, OnDestroy {
  portfolio: PortfolioState;
  positions: Position[];
  displayPortfolioGlobal = true;
  private activeContractSubscription = new Subscription()
  private livePortfolioSubscription = new Subscription()
  private activeContract: Contract

  constructor(private tradingService: TradingService,
              private data: DataService,
              private app: AppService) {
  }

  subscribeHisto(){
    this.portfolio = new PortfolioState()
    this.positions = []
    if(this.displayPortfolioGlobal){
      this.subscribeHistoPortfolio(1)
    }else{
      this.subscribeHistoPortfolio(this.activeContract.idcontract)
    }
  }

  ngOnInit() {
    this.app.portfolioChange_.subscribe(()=>{
      this.displayPortfolioGlobal = !this.displayPortfolioGlobal
      this.subscribeHisto()
    })

    this.activeContractSubscription = this.data.activeContract$
      .subscribe(contract => {
        this.activeContract = contract;
        this.subscribeHisto()
      });
  }

  subscribeHistoPortfolio(idcontract: number) {
    this.tradingService.getHistoPortfolio(idcontract).subscribe(
      p => {
        this.portfolio = p
        this.positions = p.positions
      },
      err => {
      },
      () => {
        this.subscribeLivePortfolio(idcontract)
      })
  }


  subscribeLivePortfolio(idcontract: number) {
    this.livePortfolioSubscription.unsubscribe();
    this.livePortfolioSubscription = this.tradingService.getLivePortfolio(idcontract).subscribe(mes => {
        this.portfolio = JSON.parse(mes.body)
        this.positions = this.portfolio.positions
      }
    )
  }

  onClickPortfolioChange(){
      this.app.portfolioChange_.next()
  }

  ngOnDestroy() {
    this.livePortfolioSubscription.unsubscribe()
    this.activeContractSubscription.unsubscribe()
  }

}
