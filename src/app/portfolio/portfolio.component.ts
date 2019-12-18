import {Component, OnDestroy, OnInit} from '@angular/core';
import {Portfolio} from '../config/portfolio';

import {DataService} from '../service/data.service';
import {Subscription} from 'rxjs';
import {Position} from '../config/position';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit, OnDestroy {
  portfolio: Portfolio;
  positions: Position[];
  portfolioSub: Subscription;
  portfolioLiveSub: Subscription;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.portfolioSub = this.dataService.getPorfolio().subscribe(ptf => {
      this.portfolio = JSON.parse(ptf);
      console.log(this.portfolio.positions);
      this.positions = [];
      Object.values(this.portfolio.positions).forEach((pos) => {
        this.positions.push(pos)
      })
    });

    this.portfolioLiveSub = this.dataService.getPortfolioLive().subscribe(ptf => {
      this.portfolio = JSON.parse(ptf.body);
      this.positions = [];
      Object.values(this.portfolio.positions).forEach((pos) => {
        this.positions.push(pos)
      })
    });
  }

  ngOnDestroy() {
    this.portfolioSub.unsubscribe();
    this.portfolioLiveSub.unsubscribe();
  }

}
