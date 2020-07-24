import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "../../service/data.service";
import {ProcessorState} from "../../config/processorState";
import {Subscription} from "rxjs";
import {Contract} from "../../domain/contract";
import {AppService} from "../../service/app.service";

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit, OnDestroy {
  events: ProcessorState[] =[]
  eventsOriginal: ProcessorState[] = []
  private activeContractSubscription = new Subscription()
  private liveEventsSubscription = new Subscription()
  private activeContract: Contract
  constructor(private data: DataService,
              private app: AppService) { }



  ngOnInit() {
    this.activeContractSubscription= this.data.activeContract$
      .subscribe(contract => {
        this.activeContract = contract;
        this.data.getHistoEvents(contract.idcontract).subscribe(events=>{
          this.events = events
          this.events.forEach(e=>this.eventsOriginal.push(e))
        })
      });

    this.liveEventsSubscription = this.data.getLiveEvent().subscribe(mes =>{
      const event: ProcessorState = JSON.parse(mes.body);
      this.events.unshift(event)
      if (this.events.length > this.app.numCappedEvents)
        this.events.pop();
      this.eventsOriginal.unshift(event)
      if (this.eventsOriginal.length > this.app.numCappedEvents)
        this.eventsOriginal.pop();
    })
  }

  clickOnFreq(freq){
    console.log('click on freq')
    this.events = this.eventsOriginal.filter(e=>e.freq === freq)
  }

  clickOnFreqTitle(){
    console.log('click on freq title')
    this.events = []
    this.eventsOriginal.forEach(e=>this.events.push(e))
  }

  ngOnDestroy() {
    this.activeContractSubscription.unsubscribe()
    this.liveEventsSubscription.unsubscribe()
  }

}
