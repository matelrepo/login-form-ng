import {AfterViewChecked, ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../../service/data.service';
import {GeneratorState} from '../../domain/generatorState';
import {Observable, Subscription} from 'rxjs';
import {Contract} from '../../domain/contract';
import {Candle} from '../../domain/candle';
import {debounceTime, timeInterval, timeout} from "rxjs/operators";
import {  ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuoteComponent implements OnInit, AfterViewChecked,  OnDestroy {
  generatorStateSub: Subscription;
  generatorStateHistoSub: Subscription;
  gstate: GeneratorState;
  c: Contract;
  candle: Candle;
  date: Date;
  hideMe = false;
  showCandle = true;
  hasAnimated = false;
  eventMessage: string =null

  constructor(private dataService: DataService, private cdr: ChangeDetectorRef ) {
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges()
    if(this.gstate!=undefined && !this.hasAnimated) {
      this.hasAnimated = true
     this.setAnimations(null, null)
    }

  }

  getRandomNumber(){
    return Math.random()
  }

  setAnimations(classToAdd, classToRemove){
    this.setAnimation('title',classToAdd, classToRemove);
    this.setAnimation('date-time',classToAdd, classToRemove);
    this.setAnimation('hide-me',classToAdd, classToRemove);
    this.setAnimation('active-candle-id',classToAdd, classToRemove);
    this.setAnimation('active-candle',classToAdd, classToRemove);
    this.setAnimation('timestamp',classToAdd, classToRemove);
    this.setAnimation('last-price',classToAdd, classToRemove);
    this.setAnimation('high',classToAdd, classToRemove);
    this.setAnimation('high-value',classToAdd, classToRemove);
    this.setAnimation('weekly',classToAdd, classToRemove);
    this.setAnimation('weekly-value',classToAdd, classToRemove);
    this.setAnimation('price-change',classToAdd, classToRemove);
    this.setAnimation('ask',classToAdd, classToRemove);
    this.setAnimation('bid',classToAdd, classToRemove);
    this.setAnimation('low',classToAdd, classToRemove);
    this.setAnimation('low-value',classToAdd, classToRemove);
    this.setAnimation('volume',classToAdd, classToRemove);
    this.setAnimation('volume-value',classToAdd, classToRemove);
    this.setAnimation('yearly',classToAdd, classToRemove);
    this.setAnimation('yearly-value',classToAdd, classToRemove);
    this.setAnimation('monthly',classToAdd, classToRemove);
    this.setAnimation('monthly-value',classToAdd, classToRemove);
    this.setAnimation('event-message',classToAdd, classToRemove);


  }

  setAnimation(classId, classToAdd, classRoRemove){
    let body = document.getElementsByClassName(classId)[0];
    if(body!=undefined) {
      if (classToAdd == null) {
        if (this.getRandomNumber() > 0.5) {
          body.classList.add('animate-up-1');
        } else {
          body.classList.add('animate-down-1');
        }
      } else {
        if (body.classList.contains(classRoRemove + '-1')) {
          body.classList.remove(classRoRemove + '-1')
        } else {
          body.classList.remove(classRoRemove + '-2')
        }
        if (body.classList.contains(classToAdd + '-1')) {
          body.classList.remove(classToAdd + '-1')
          body.classList.add(classToAdd + '-2');

        } else {
          body.classList.remove(classToAdd + '-2')
          body.classList.add(classToAdd + '-1');
        }
      }
    }
  }

  ngOnInit() {
    setInterval(() => {
      this.date = new Date();
    }, 1000);

    this.dataService.activeCandle$.subscribe(candle => {
      this.showCandle=true
      this.candle = candle;
      // setTimeout(() => {
      //   this.showCandle = false
      // }, 10000);
    });

    this.dataService.activeContract$.subscribe(contract => {
      if (this.gstate !== undefined) {
        this.generatorStateSub.unsubscribe();
      }
      this.c = contract;
      this.candle = null;


      this.generatorStateHistoSub = this.dataService.getHistoQuote(this.c.idcontract).subscribe(quote => {
        this.gstate = quote;
        this.generatorStateHistoSub.unsubscribe();
      });

      this.generatorStateSub = this.dataService.getLiveQuote(this.c.idcontract)
        .subscribe((message) => {
          this.gstate = JSON.parse(message.body);
        });
    });

  }

  hideButton(){
    this.eventMessage ="(5) Minimum Detected (Value 20 - Target 25)"
    setTimeout( ()=> this.eventMessage =null,60000)
    this.cdr.detectChanges()
    this.setAnimations('animate-up','animate-down')
    this.hideMe = !this.hideMe;


  }

  ngOnDestroy() {
    this.generatorStateSub.unsubscribe();
  }

}
