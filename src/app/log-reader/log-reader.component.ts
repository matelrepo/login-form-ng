import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AppService} from "../service/app.service";
import {fromEvent, Subscribable, Subscription} from "rxjs";
import {Messenger} from "../domain/messenger";
import {tap} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-log-reader',
  templateUrl: './log-reader.component.html',
  styleUrls: ['./log-reader.component.css']
})
export class LogReaderComponent implements OnInit {
  messages: Messenger[] = []
  config = {
    id: 'custom',
    itemsPerPage: 100,
    currentPage: 1,
    totalItems: this.messages.length
  };
  logSubscription = new Subscription()

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.getHistoricalLogs().subscribe(messages => {
      this.messages = messages
      this.logSubscription = this.appService.getLogs().subscribe(l=>{
        const mes: Messenger = JSON.parse(l.body)
        this.messages.unshift(mes)
      })
    })
  }

}
