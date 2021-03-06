import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../service/data.service";
import {ProcessorState} from "../../domain/processorState";
import {Subscription} from "rxjs";
import {Contract} from "../../domain/contract";
import {AppService} from "../../service/app.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit, OnDestroy {
  events: ProcessorState[] =[]
  showHeader = false;
  config = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: this.events.length
  };
  eventsOriginal: ProcessorState[] = []
  private activeContractSubscription = new Subscription()
  private liveEventsSubscription = new Subscription()
  private activeContract: Contract


  constructor(private data: DataService,
              private app: AppService, private router: Router) { }

  ngOnInit() {
    if(this.router.url==='/events-list')
      this.showHeader = true
    this.activeContractSubscription= this.data.activeContract$
      .subscribe(contract => {
        this.activeContract = contract;
        this.data.getHistoEvents(contract.idcontract).subscribe(events=>{
          this.events = events
          if(events!=null)
          this.events.forEach(e=>this.eventsOriginal.push(e))
          this.subscribeLiveEvents()
        })
      });

  }

  subscribeLiveEvents(){
    this.liveEventsSubscription = this.data.getLiveEvents().subscribe(mes =>{
      const event: ProcessorState = JSON.parse(mes.body);
      // if(event.isResistance || event.isSupport) {
        this.events.unshift(event)
        if (this.events.length > this.app.numCappedEvents)
          this.events.pop();
        this.eventsOriginal.unshift(event)
        if (this.eventsOriginal.length > this.app.numCappedEvents)
          this.eventsOriginal.pop();
      // }
    })
  }

  filterEventsByContractAndFreq(freq){
    this.events = this.eventsOriginal.filter(e=>e.freq === freq)
    this.liveEventsSubscription.unsubscribe()
    this.liveEventsSubscription = this.data.getLiveEventsByContractByFreq(this.activeContract.idcontract, freq).subscribe(mes =>{
      const event: ProcessorState = JSON.parse(mes.body);
      // if(event.isResistance || event.isSupport) {
        this.events.unshift(event)
        if (this.events.length > this.app.numCappedEvents)
          this.events.pop();
      // }
    })
  }

  filterEventsByContract(idcontract: number){
    this.events = this.eventsOriginal.filter(e=>e.idcontract === idcontract)
    this.liveEventsSubscription.unsubscribe()
    this.liveEventsSubscription = this.data.getLiveEventsByContract(idcontract).subscribe(mes =>{
      const event: ProcessorState = JSON.parse(mes.body);
      // if(event.isResistance || event.isSupport) {
      this.events.unshift(event)
      if (this.events.length > this.app.numCappedEvents)
        this.events.pop();
      // }
    })
  }

  displayAllEvents(){
    this.events = []
    this.eventsOriginal.forEach(e=>this.events.push(e))
    this.liveEventsSubscription.unsubscribe()
    this.subscribeLiveEvents()
  }

  ngOnDestroy() {
    this.activeContractSubscription.unsubscribe()
    this.liveEventsSubscription.unsubscribe()
  }

  checkFreqAsChangeInTable(i: number){
    switch(this.events[i].freq){
      case 0:
        return '#7f7e7e'
      case 1:
        return '#686868'
      case 5:
        return '#616161'
      case 15:
        return '#535353'
      case 60:
        return '#424242'
      case 240:
        return '#2f2f2f'
      case 480:
        return '#99966d'
      default:
        return '#989134'
        break;
    }
  }

}
