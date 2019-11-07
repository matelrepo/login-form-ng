import { Component, OnInit } from '@angular/core';
import {Contract} from '../config/contract';
import {DataService} from '../service/data.service';

@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.css']
})
export class ContractsListComponent implements OnInit {
  contracts$;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.contracts$ = this.data.getContracts();
  }

}
