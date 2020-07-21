import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {User} from '../domain/user';
import {DOCUMENT} from '@angular/common';
import {Chart} from '../domain/chart';
import {AppService} from '../service/app.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  user: User;

  constructor(
              private auth: AuthService) {
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.user = user;
    });
    // this.appService.chart$.subscribe(chart => {
    //   if (chart.width < 0) {
    //     this.resizeChart(chart);
    //   }
    // });
  }


  // resizeChart(chart: Chart) {
  //   console.log('o');
  //   const element = document.getElementById(chart.id);
  //
  //   if (element.classList.contains('chart')) {
  //     element.classList.remove('chart');
  //     element.classList.add('chart-selected');
  //   } else {
  //     element.classList.add('chart');
  //     element.classList.remove('chart-selected');
  //   }
  //   // this.appService.notifyChartResize(chart)
  // }


}
