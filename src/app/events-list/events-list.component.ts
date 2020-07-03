import { Component, OnInit } from '@angular/core';
import {DataService} from "../service/data.service";
import {ProcessorState} from "../config/processorState";
import {Candle} from "../config/candle";
import {MyEvent} from "../config/myEvent";

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit {
  events: MyEvent[]
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getHistoEvents(2).subscribe(events =>{
      this.events = events
      console.log(events)
    })

    this.dataService.getLiveEvent().subscribe(mes =>{
      const event: MyEvent = JSON.parse(mes.body);
      this.events.push(event)
    })
  }

}
