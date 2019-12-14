import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter, AfterViewInit, Input, OnChanges, DoCheck
} from '@angular/core';
import {Message} from '@stomp/stompjs';
import {Subscription, Subject, Observable, of} from 'rxjs';
import {Candle} from '../config/candle';
import {Contract} from '../config/contract';
import {DataService} from '../service/data.service';
import {AppService} from '../service/app.service';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy, DoCheck {
  constructor( private dataService: DataService, private appService: AppService) {}

  private activeContractSub: Subscription
  private liveSub$: Subscription
  private liveHisto$: Subscription
  private chartChange$: Subscription

  @Input() freq
  @Input() id
  @ViewChild('chartRef', {static: false}) canvasRef: ElementRef
  @ViewChild('divRef', {static: false}) divRef: ElementRef
  canvas: HTMLCanvasElement
  private gc: CanvasRenderingContext2D
  private widthCandle = 3;
  private width = 5;
  private min;
  private max;
  private candles: Candle[] = [];
  private currentZoomValue = 40;
  private data = new Map();
  private colorUp = 'lightgreen';
  private colorDown = '#ff0000';
  private dragStart = 0;
  private dragEnd = 0;
  private dragCumul = 0;
  private isDrag = false;
  // private displayCandle$ = new Subject<Candle>();
  private activeContract: Contract;

  ngAfterViewInit(){
    this.init()
  }

  init() {
    if (this.canvasRef != undefined) {
      this.canvas = this.canvasRef.nativeElement;
      this.gc = this.canvas.getContext('2d');
      this.canvasRef.nativeElement.style.width = '100%';
      this.canvasRef.nativeElement.style.height = '100%';
      this.canvasRef.nativeElement.height = this.divRef.nativeElement.offsetHeight;
      this.canvasRef.nativeElement.width = this.divRef.nativeElement.offsetWidth;
      this.draw();
    }
  }

  ngDoCheck() {

  }

  ngOnInit() {
    this.dataService.activeContract$.subscribe( contract => {
      this.activeContract = contract
      // if (this.candles.length > 0) {
      this.candles = []
      this.draw()
    // }

      // this.subscribeHisto(0)
      this.subscribeHisto()
      })

    this.appService.chart$.subscribe(chart =>{
      if(this.id == chart.id){
        this.init()
      }
    })
  }

  subscribeLive(){
    if (this.liveHisto$ != undefined) {
      this.liveHisto$.unsubscribe();
    }
    if (this.liveSub$ != undefined) {
      this.liveSub$.unsubscribe()
    }
    this.liveSub$  = this.dataService.getLiveTicks(this.activeContract.idcontract, this.freq).subscribe(mes => {
      const candle: Candle = JSON.parse(mes.body);
      if (this.freq == candle.freq && this.candles != null) {
        if (candle.freq ==0 || candle.id !== this.candles[0].id) {
          this.candles.unshift(candle)
        } else {
          this.candles[0] = candle
        }
        this.draw()
        if (this.candles.length > 100)
          this.candles.pop();
      }

    });
  }

  subscribeHisto(){
    if (this.liveHisto$ != undefined) {
      this.liveHisto$.unsubscribe();
    }
    if (this.liveSub$ != undefined) {
      this.liveSub$.unsubscribe()
    }
    this.dataService.getHistoCandles(this.activeContract.idcontract, this.freq).subscribe(candles =>{
      this.candles = candles;
      this.draw()
      this.subscribeLive()
    });
  }


  ngOnDestroy() {
    if (this.activeContractSub != undefined) {
      this.activeContractSub.unsubscribe();
    }
    if (this.liveSub$ != undefined) {
      this.liveSub$.unsubscribe();
    }
    if (this.liveHisto$ != undefined) {
      this.liveHisto$.unsubscribe();
    }
    if (this.chartChange$ != undefined) {
      this.chartChange$.unsubscribe()
    }
  }

  draw() {
    if(this.candles!= null) {
      if (this.canvas != undefined) {
        this.data = new Map()
        this.gc.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.gc.fillStyle ='black'
        // this.gc.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.min = this.getTrailingMin(this.currentZoomValue);
        this.max = this.getTrailingMax(this.currentZoomValue);

        let x = 1 - this.dragEnd;
        for (let candle of this.candles) {
          if (candle.color == 1) {
            this.colorUp = 'lightgreen';
            this.colorDown = 'lightgreen';
          } else if (candle.color == 2) {
            this.colorUp = 'green';
            this.colorDown = 'green';
          } else if (candle.color > 2) {
            // this.colorUp = 'yellow';
            // this.colorDown = 'yellow';
          } else if (candle.color == -1) {
            this.colorUp = 'salmon';
            this.colorDown = 'salmon';
          } else if (candle.color == -2) {
            this.colorUp = 'red';
            this.colorDown = 'red';
          } else if (candle.color < -2) {
            // this.colorUp = 'orange';
            // this.colorDown = 'orange';
          } else {
            this.colorUp = 'black';
            this.colorDown = 'black';
          }

          if (candle.high - candle.low > candle.abnormalHeightLevel) {
            this.colorUp = 'yellow';
            this.colorDown = 'yellow';
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

          this.gc.beginPath();
          this.gc.moveTo(time, this.getYPixel(candle.closeAverage));
          this.gc.lineTo(time + this.widthCandle, this.getYPixel(candle.closeAverage));
          this.gc.stroke();

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
    }
  }

  /** Convert bar value to y coordinate. */
  getYPixel(v: number) {
    let span = (this.max - this.min) * 1.1;
    return ((this.max - v) * this.canvas.height) / span + 10;
  }

  getYPrice(v) {
    let span = this.max - this.min;
    const tmp = ((this.canvas.height - v) * span) / this.canvas.height;
    return tmp + this.min;
  }

  getX(v) {
    let pct = (this.currentZoomValue * this.width) / this.canvas.width;
    return this.canvas.width - v / pct -20;
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
  onMouseMove(ev: MouseEvent) {
    if (this.isDrag) {
      this.dragEnd = this.dragCumul + ev.clientX - this.dragStart;
      this.draw();
    }

    if (this.data.get(ev.layerX)) {
      // console.log(this.data.get(ev.layerX))
      this.dataService.activeCandle.next(this.data.get(ev.layerX))
      // this.displayCandle$.next(this.data.get(ev.layerX));
    }
  }

  onMouseDown(ev: MouseEvent) {
    this.isDrag = true;
    this.dragStart = ev.clientX;
  }

  onMouseUp() {
    if (this.isDrag) {
      this.dragCumul = this.dragEnd;
      this.isDrag = false;
    }
  }

  onMouseDblClick() {
    this.dragCumul = 0;
    this.dragEnd = 0;
    this.draw();
  }

  resize(event){
    this.appService.notifyChartResize({ id: this.id, width: -1, height: -1})
    if (this.currentZoomValue < 50) this.currentZoomValue = 100
    else this.currentZoomValue = 40
    event.stopPropagation();
  }

  onChange(value: number){
    this.currentZoomValue = value
    this.draw()
  }

}
