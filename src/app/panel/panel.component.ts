import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {User} from '../config/user';
import {Router} from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {Chart} from '../config/chart';
import {toNumbers} from '@angular/compiler-cli/src/diagnostics/typescript_version';
import {AppService} from '../service/app.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  user: User

  constructor(@Inject(DOCUMENT) document,
              private auth: AuthService,
              private appService: AppService) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.user = user;
    });
    this.appService.chart$.subscribe(chart => {
      if(chart.width<0)
      this.resizeChart(chart)
    })
  }

  @HostListener('window:scroll', ['$event'])

  onWindowScroll(e) {
    if (window.pageYOffset > 0) {
      let element_nav = document.getElementById('navbar');
      element_nav.classList.add('sticky2');
      let element_gap = document.getElementById('list-contract-gap');
      element_gap.classList.add('list-gap');
    } else {
      let element_nav = document.getElementById('navbar');
      element_nav.classList.remove('sticky2');
      let element_gap = document.getElementById('list-contract-gap');
      element_gap.classList.remove('list-gap');
    }
  }

  resizeChart(chart: Chart){
    console.log('o')
    let element = document.getElementById(chart.id)

    if (element.classList.contains('chart')) {
      element.classList.remove('chart')
      element.classList.add('chart-selected')
    } else {
      element.classList.add('chart')
      element.classList.remove('chart-selected')
    }
    // this.appService.notifyChartResize(chart)
  }


}
