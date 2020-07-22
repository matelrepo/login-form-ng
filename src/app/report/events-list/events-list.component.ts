import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "../../service/data.service";
import {ProcessorState} from "../../config/processorState";
import {Subscription} from "rxjs";
import {Contract} from "../../domain/contract";

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
  constructor(private dataService: DataService) { }



  ngOnInit() {
    this.activeContractSubscription= this.dataService.activeContract$
      .subscribe(contract => {
        this.activeContract = contract;
        this.dataService.getHistoEvents(contract.idcontract).subscribe(events=>{
          this.events = events
          this.events.forEach(e=>this.eventsOriginal.push(e))
        })
      });

    this.liveEventsSubscription = this.dataService.getLiveEvent().subscribe(mes =>{
      const event: ProcessorState = JSON.parse(mes.body);
      this.events.unshift(event)
      this.eventsOriginal.unshift(event)
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
