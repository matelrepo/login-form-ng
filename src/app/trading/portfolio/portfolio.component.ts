import {Component, OnDestroy, OnInit} from '@angular/core';
import {PortfolioState} from '../../domain/portfolioState';
import {Position} from '../../domain/position';
import {TradingService} from "../../service/trading.service";
import {DataService} from "../../service/data.service";
import {Subscription} from "rxjs";
import {Contract} from "../../domain/contract";

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit, OnDestroy {
  portfolio: PortfolioState;
  positions: Position[];
  private activeContractSubscription = new Subscription()
  private livePortfolioSubscription = new Subscription()
  private activeContract: Contract

  constructor(private tradingService: TradingService,
              private data: DataService) {
  }

  ngOnInit() {
    this.activeContractSubscription = this.data.activeContract$
      .subscribe(contract => {
        this.activeContract = contract;
        this.subscribeHistoPortfolio(contract.idcontract)
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
      () => this.subscribeLivePortfolio(idcontract))
  }

  subscribeLivePortfolio(idcontract: number) {
    this.livePortfolioSubscription.unsubscribe();
    this.livePortfolioSubscription = this.tradingService.getLivePortfolio(idcontract).subscribe(mes => {
        this.portfolio = JSON.parse(mes.body)
        this.positions = this.portfolio.positions
      }
    )
  }

  ngOnDestroy() {
    this.activeContractSubscription.unsubscribe()
  }

}
