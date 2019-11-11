import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter, AfterViewInit
} from '@angular/core';
import {Message} from '@stomp/stompjs';
import {Subscription, Subject} from 'rxjs';
import {Candle} from '../config/candle';
import {Contract} from '../config/contract';
import {DataService} from '../service/data.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor( private dataService: DataService) {}

  // @Output() activeComponent = new EventEmitter()
  @ViewChild('chartRef', {static: false}) canvasRef: ElementRef

  private widthChart
  private heightChart
  private gc: CanvasRenderingContext2D

  private activeContractSub: Subscription
  // private candlesLive$: Subscription
  // private candlesHisto$: Subscription

  private widthCandle = 3;
  private width = 5;
  private min;
  private max;
  private candles: Candle[] = [];
  private currentZoomValue = 100;
  private data = new Map();
  private colorUp = 'lightgreen';
  private colorDown = '#ff0000';
  private dragStart = 0;
  private dragEnd = 0;
  private dragCumul = 0;
  private isDrag = false;
  private title: string;
  private titleClass: string;
  private progress: number;
  private speed: number = 100;
  private displayCandle$ = new Subject<Candle>();
  private liveCandle$ = new Subject<Candle>();
  private activeContract: Contract;

  ngAfterViewInit(){
    this.gc = this.canvasRef.nativeElement.getContext('2d')
    this.canvasRef.nativeElement.style.width = '100%'
    this.canvasRef.nativeElement.style.height = '100%'
    this.widthChart = this.canvasRef.nativeElement.width
    this.heightChart = this.canvasRef.nativeElement.height

  }

  ngOnInit() {
    this.dataService.activeContract$.subscribe( contract => {
      this.activeContract = contract
      console.log(contract)
      //sub histo
      //sub live
      this.dataService.getLiveTicks(this.activeContract.id).subscribe(mes => {
        this.candles.unshift(JSON.parse(mes.body))
        this.draw()
        console.log(this.candles[0])
        if(this.candles.length>100)
          this.candles.pop();
      });
    });


    // this.contractService.getActiveContract().subscribe((contract: Contract) => {
    //   // if (this.activeContract.freq != contract.freq) {
    //   //   this.activeContract = contract;
    //   //   this.reqFreqChange();
    //   // }
    //   this.activeContract = contract;
    //   if (this.activeContract != undefined) {
    //     this.unSubscribeHisto();
    //     this.subscribeHisto();
    //     this.dataService.reqHistoCandles(this.activeContract);
    //   }
    // });
  }

  // subscribeHisto() {
  //   if (this.candlesLive$ != undefined) {
  //     this.candlesLive$.unsubscribe();
  //   }
  //   this.candlesHisto$ = this.dataService
  //     .getHistoCandles(this.activeContract)
  //     .subscribe((message: Message) => {
  //       const can: Candle[] = JSON.parse(message.body);
  //       this.candles = can.slice(0, 8000);
  //       //if (this.candles.length > 0) {
  //       this.draw();
  //       this.subscribeLiveCandles();
  //       //}
  //     });
  // }
  //
  // subscribeLiveCandles() {
  //   this.candlesLive$ = this.dataService
  //     .getLiveCandles(this.activeContract)
  //     .subscribe((message: Message) => {
  //       const candle: Candle = JSON.parse(message.body);
  //       this.speed = candle.speed;
  //       this.progress = candle.progress;
  //       if (
  //         candle.idcontract == this.activeContract.idcontract &&
  //         candle.freq == this.activeContract.freq
  //       ) {
  //         if (candle.newCandle) {
  //           this.candles.unshift(candle);
  //           if (this.candles.length > 1000) {
  //             this.candles.pop();
  //           }
  //         } else {
  //           this.candles[0] = candle;
  //         }
  //
  //         // if (this.freq == 0) this.dataService.setActiveCandle(candle);
  //
  //         this.draw();
  //       }
  //     });
  // }

  ngOnDestroy() {
    this.activeContractSub.unsubscribe();
  }

  // unSubscribeHisto() {
  //   if (this.candlesHisto$ != undefined) {
  //     this.candlesHisto$.unsubscribe();
  //   }
  // }

  // reqFreqChange() {
  //   this.unSubscribeHisto();
  //   this.subscribeHisto();
  //   this.dataService.reqHistoCandles(this.activeContract);
  // }

  draw() {
    this.data = new Map()
    // this.gc.fillStyle ='black'
    this.gc.clearRect(0, 0, this.widthChart, this.heightChart);
    // this.gc.fillRect(0, 0, this.widthChart, this.heightChart);
    this.min = this.getTrailingMin(this.currentZoomValue);
    this.max = this.getTrailingMax(this.currentZoomValue);

    let x = 1 - this.dragEnd;
    for (let candle of this.candles) {
      if (candle.color == 1) {
        this.colorUp = 'lightgreen';
        this.colorDown = 'lightgreen';
      } else if (candle.color > 1) {
        this.colorUp = 'green';
        this.colorDown = 'green';
      } else if (candle.color == -1) {
        this.colorUp = 'salmon';
        this.colorDown = 'salmon';
      } else if (candle.color < -1) {
        this.colorUp = 'red';
        this.colorDown = 'red';
      } else {
        this.colorUp = 'black';
        this.colorDown = 'black';
      }

      let time = this.getX(x) - 10;
      if (time < 0) {
        break;
      }
      this.data.set(Math.round(time), candle);
      this.data.set(Math.round(time) - 1, candle);
      this.data.set(Math.round(time) + 1, candle);
      let high = this.getYPixel(candle.high);
      let low = this.getYPixel(candle.low);
      let open = this.getYPixel(candle.open);
      let close = this.getYPixel(candle.close);

      this.gc.strokeStyle = 'black';
      this.gc.beginPath();
      this.gc.moveTo(time + this.widthCandle / 2, high);
      this.gc.lineTo(time + this.widthCandle / 2, low);
      this.gc.stroke();

      console.log(open + " " + high + " " + low + " " + close)

      if (candle.open <= candle.close) {
        this.gc.fillStyle = this.colorUp;
        this.gc.fillRect(time, close, this.widthCandle, open - close);
      } else {
        this.gc.fillStyle = this.colorDown;
        this.gc.fillRect(time, open, this.widthCandle, close - open);
      }

      x += this.width;
    }
  }

  /** Convert bar value to y coordinate. */
  getYPixel(v: number) {
    let span = (this.max - this.min) * 1.1;
    return ((this.max - v) * this.heightChart) / span + 10;
  }

  getYPrice(v) {
    let span = this.max - this.min;
    const tmp = ((this.heightChart - v) * span) / this.heightChart;
    return tmp + this.min;
  }

  getX(v) {
    let pct = (this.currentZoomValue * this.width) / this.widthChart;
    return this.widthChart - v / pct;
  }

  getTrailingMin(numDays) {
    let min = Number.MAX_VALUE;
    let i = 1 - this.dragEnd;
    this.candles.forEach(candle => {
      if (i < numDays) {
        if (candle.low < min) {
          min = candle.low;
        }
      }
      i++;
    });
    return min;
  }

  getTrailingMax(numDays) {
    let max = 0;
    let i = 1 - this.dragEnd;
    this.candles.forEach(candle => {
      if (i < numDays) {
        if (candle.high > max) {
          max = candle.high;
        }
      }
      i++;
    });
    return max;
  }

  // onClickZoomMore() {
  //   this.currentZoomValue = this.currentZoomValue + 10;
  //   this.draw();
  // }
  //
  // onClickZoomLess() {
  //   this.currentZoomValue = this.currentZoomValue - 10;
  //   this.draw();
  // }
  //
  // onMouseMove(ev: MouseEvent) {
  //   if (this.isDrag) {
  //     this.dragEnd = this.dragCumul + ev.clientX - this.dragStart;
  //     this.draw();
  //   }
  //
  //   if (this.data.get(ev.layerX)) {
  //     this.displayCandle$.next(this.data.get(ev.layerX));
  //     // console.log(this.data.get(ev.layerX));
  //   }
  // }
  //
  // onMouseDown(ev: MouseEvent) {
  //   this.isDrag = true;
  //   this.dragStart = ev.clientX;
  //   //  this.activeComponent.next(this.componentId);
  // }
  //
  // onMouseUp() {
  //   if (this.isDrag) {
  //     this.dragCumul = this.dragEnd;
  //     this.isDrag = false;
  //   }
  // }
  //
  // onMouseDblClick() {
  //   this.dragCumul = 0;
  //   this.dragEnd = 0;
  //   this.draw();
  // }
}
