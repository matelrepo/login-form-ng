import {Component, OnInit} from '@angular/core';
import {DataService} from '../service/data.service';
import {AuthService} from '../service/auth.service';
import {Observable} from 'rxjs';
import {Macro} from '../config/macro';
import {AppService} from '../service/app.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username: string
  tickers: Macro[]
  arrow: string;

  constructor(private dataService: DataService, private auth: AuthService, private appService: AppService) {
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.username = user.username)
    this.dataService.getTickerCrawl().subscribe( list => {
      this.tickers = list
    })
  }

  logout() {
    this.auth.logout()
  }

  onClickPortfolio(){
    this.appService.displayPortfolio = !this.appService.displayPortfolio;
  }

  onClickFutures(){
    this.appService.displayMacro = false
    this.appService.displayChart = true;
    this.appService.displayUpdateContract = false;
  }

  onClickProcessorLogs(){
    this.appService.displayProcessorLogs = !this.appService.displayProcessorLogs;

  }

  onClickMacro(){
    this.appService.displayMacro = !this.appService.displayMacro;
    this.appService.displayChart = false;
    this.appService.displayUpdateContract = false;
  }

  onClickContractUpdate(){
    this.appService.displayUpdateContract = !this.appService.displayUpdateContract;
    this.appService.displayChart = false;
    this.appService.displayMacro = false

  }

  onRowClick(ticker: Macro){
    window.open("https://www.quandl.com/data/SGE/" + ticker.code, "_blank");    }

}
