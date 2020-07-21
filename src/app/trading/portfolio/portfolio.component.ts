import {Component, OnDestroy, OnInit} from '@angular/core';
import {Portfolio} from '../../domain/portfolio';
import {Position} from '../../domain/position';
import {TradingService} from "../../service/trading.service";

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit, OnDestroy {
  portfolio: Portfolio;
  positions: Position[];

  constructor(private tradingService: TradingService) {
  }

  ngOnInit() {
    this.tradingService.getLivePortfolio().subscribe( mes => {
        this.portfolio = JSON.parse(mes.body);
        this.positions = this.portfolio.positions;
      }
    )
  }

  ngOnDestroy() {

  }

}
