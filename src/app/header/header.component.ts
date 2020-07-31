import {Component, OnInit} from '@angular/core';
import {DataService} from '../service/data.service';
import {AuthService} from '../service/auth.service';
import {AppService} from '../service/app.service';
import {subscribeOn} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username: string;
  date: Date;

  constructor(private dataService: DataService, private auth: AuthService, private appService: AppService) {
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.username = user.username);
    setInterval(() => {
      this.date = new Date();
    }, 1000);
  }

  logout() {
    this.auth.logout();
  }

  // getMainPanel() {
  //   this.appService.displayChart = true;
  //   // this.appService.displaySaveContract = false;
  //   // this.appService.displayExpirationReport = false;
  //   // this.appService.displayDailyStocksReport = false;
  // }

  getAppService(){
    return this.appService
  }


  onConnectAll() {
    this.dataService.connectAll().subscribe();
  }
  onDisConnectAll() {
    this.dataService.disconnectAll().subscribe();
  }


  // onClickSaveContract() {
  //   // this.appService.displaySaveContract = !this.appService.displaySaveContract;
  //   this.appService.displayChart = false;
  // }

  activateEmails() {
    this.appService.sendEmail = !this.appService.sendEmail;
    this.appService.activateEmail().subscribe();
  }

  sendEmailTest() {
    this.appService.sendEmailTest().subscribe();
  }

  onClickPortfolioChange(){
    this.appService.portfolioChange_.next()
  }

  // getExpirationReport(){
  //   this.appService.displayChart = false;
  //   this.appService.displaySaveContract = false;
  //   this.appService.displayExpirationReport = true;
  //   this.appService.displayDailyStocksReport = false;
  // }
  //
  // getDailyStocksReport(){
  //   this.appService.displayChart = false;
  //   this.appService.displaySaveContract = false;
  //   this.appService.displayExpirationReport = false;
  //   this.appService.displayDailyStocksReport = true;
  // }


}
