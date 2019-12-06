import {Component, OnInit} from '@angular/core';
import {DataService} from '../service/data.service';
import {AuthService} from '../service/auth.service';
import {Observable} from 'rxjs';
import {Macro} from '../config/macro';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username: string
  tickers: Macro[]
  arrow: string;

  constructor(private dataService: DataService, private auth: AuthService) {
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.username = user.username)
    this.dataService.getTickerCrawl().subscribe( list => {
      this.tickers = list
      console.log(this.tickers)
    })
  }

  logout() {
    this.auth.logout()
  }

  onRowClick(ticker: Macro){
    window.open("https://www.quandl.com/data/SGE/" + ticker.code, "_blank");    }

}
