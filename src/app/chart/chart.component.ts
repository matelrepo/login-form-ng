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
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor( private dataService: DataService, private appService: AppService) {}

  private activeContractSub: Subscription;
  private liveSub$: Subscription;
  private liveHisto$: Subscription;
  private chartChange$: Subscription;

  @Input() freq;
  @Input() id;
  @ViewChild('chartRef', {static: false}) canvasRef: ElementRef;
  @ViewChild('divRef', {static: false}) divRef: ElementRef;
  canvas: HTMLCanvasElement;
  private gc: CanvasRenderingContext2D;
  private widthCandle = 3;
  private width = 5;
  private min;
  private max;
  private candles: Candle[] = [];
  private currentZoomValue = 40;
  private data = new Map();
  private colorUp = 'lightgreen';
  private colorDown = '#ff0000';
  private colorMat = '#FF2FC5';
  private dragStart = 0;
  private dragEnd = 0;
  private dragCumul = 0;
  private isDrag = false;
  private activeContract: Contract;

  ngAfterViewInit() {
    this.init();
  }

  init() {
    if (this.canvasRef !== undefined) {
      this.canvas = this.canvasRef.nativeElement;
      this.gc = this.canvas.getContext('2d');
      this.canvasRef.nativeElement.style.width = '100%';
      this.canvasRef.nativeElement.style.height = '100%';
      this.canvasRef.nativeElement.height = this.divRef.nativeElement.offsetHeight;
      this.canvasRef.nativeElement.width = this.divRef.nativeElement.offsetWidth;
      this.draw();
    }
  }


  ngOnInit() {
    this.dataService.activeContract$.subscribe( contract => {
      this.activeContract = contract;
      this.candles = [];
      this.draw();
      this.subscribeHisto();
      });

    this.appService.chart$.subscribe(chart => {
      if (this.id === chart.id) {
        this.init();
      }
    });
  }

  subscribeLive() {
    if (this.liveHisto$ !== undefined) {
      this.liveHisto$.unsubscribe();
    }
    if (this.liveSub$ !== undefined) {
      this.liveSub$.unsubscribe();
    }
    this.liveSub$  = this.dataService.getLiveTicks(this.activeContract.idcontract, this.freq).subscribe(mes => {
      const candle: Candle = JSON.parse(mes.body);
      if (this.freq === candle.freq && this.candles.length > 0) {
        if (candle.freq === 0 || candle.id !== this.candles[0].id) {
          this.candles.unshift(candle);
        } else {
          this.candles[0] = candle;
        }
        this.draw();
        if (this.candles.length > 100) {
          this.candles.pop();
        }
      } else {
        this.candles.unshift(candle);
      }

    });
  }

  subscribeHisto() {
    if (this.liveHisto$ !== undefined) {
      this.liveHisto$.unsubscribe();
    }
    if (this.liveSub$ !== undefined) {
      this.liveSub$.unsubscribe();
    }
    this.dataService.getHistoCandles(this.activeContract.idcontract, this.activeContract.symbol, this.freq).subscribe(candles => {
      this.candles = candles;
      this.draw();
      if (this.activeContract.idcontract < 10000) {
      this.subscribeLive();
      }
    });

  }


  ngOnDestroy() {
    if (this.activeContractSub !== undefined) {
      this.activeContractSub.unsubscribe();
    }
    if (this.liveSub$ !== undefined) {
      this.liveSub$.unsubscribe();
    }
    if (this.liveHisto$ !== undefined) {
      this.liveHisto$.unsubscribe();
    }
    if (this.chartChange$ !== undefined) {
      this.chartChange$.unsubscribe();
    }
  }

  draw() {
    if (this.candles != null) {
      if (this.canvas !== undefined) {
        this.data = new Map();
        this.gc.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.gc.fillStyle ='black'
        // this.gc.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.min = this.getTrailingMin(this.currentZoomValue) ;
        this.max = this.getTrailingMax(this.currentZoomValue);

        let x = 1 - this.dragEnd;
        for (const candle of this.candles) {
          if (candle.color === 1) {
            this.colorUp = 'lightgreen';
            this.colorDown = 'lightgreen';
            this.colorMat = 'lightgreen';
          } else if (candle.color === 2) {
            this.colorUp = 'green';
            this.colorDown = 'green';
            this.colorMat = 'green';
          } else if (candle.color > 2) {
            // this.colorUp = 'yellow';
            // this.colorDown = 'yellow';
          } else if (candle.color === -1) {
            this.colorUp = 'salmon';
            this.colorDown = 'salmon';
            this.colorMat = 'salmon';
          } else if (candle.color === -2) {
            this.colorUp = 'red';
            this.colorDown = 'red';
            this.colorMat = 'red';
          } else if (candle.color < -2) {
            // this.colorUp = 'orange';
            // this.colorDown = 'orange';
          } else {
            this.colorUp = 'black';
            this.colorDown = 'black';
            this.colorMat = 'black';
          }

          if (candle.high - candle.low > candle.abnormalHeightLevel) {
            this.colorMat = 'yellow';
          }


          const time = this.getX(x) - 10;
          if (time < 0) {
            break;
          }
          this.data.set(Math.round(time), candle);
          this.data.set(Math.round(time) - 1, candle);
          this.data.set(Math.round(time) + 1, candle);
          const high = this.getYPixel(candle.high);
          const low = this.getYPixel(candle.low);
          const open = this.getYPixel(candle.open);
          const close = this.getYPixel(candle.close);
          const midPrice = this.getYPixel((candle.open + candle.close) / 2);

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
            this.gc.fillStyle = this.colorMat;
            this.gc.fillRect(time, close, this.widthCandle, open - midPrice);
            this.gc.fillStyle = this.colorUp;
            this.gc.fillRect(time, close + open - midPrice, this.widthCandle, open - (close + open - midPrice));
          } else {
            // this.gc.fillStyle = this.colorDown;
            // this.gc.fillRect(time, open, this.widthCandle, close - open);
            this.gc.fillStyle = this.colorDown;
            this.gc.fillRect(time, open, this.widthCandle, close - midPrice);
            this.gc.fillStyle = this.colorMat;
            this.gc.fillRect(time, open + close - midPrice, this.widthCandle, close - (open + close - midPrice));
          }

          x += this.width;
        }
      }
    }
  }

  /** Convert bar value to y coordinate. */
  getYPixel(v: number) {
    const span = (this.max - this.min) * 1.1;
    return ((this.max - v) * this.canvas.height) / span + 10;
  }

  getYPrice(v) {
    const span = this.max - this.min;
    const tmp = ((this.canvas.height - v) * span) / this.canvas.height;
    return tmp + this.min;
  }

  getX(v) {
    const pct = (this.currentZoomValue * this.width) / this.canvas.width;
    return this.canvas.width - v / pct - 20;
  }

  getTrailingMin(numDays) {
    let min = Number.MAX_VALUE;
    let i = 1 - this.dragEnd;
    this.candles.forEach(candle => {
      if (i < numDays) {
        if (candle.low < min) {
          min = candle.low;
        }
        if (candle.closeAverage < min && candle.closeAverage > 0) {
          min = candle.closeAverage;
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
        if (candle.closeAverage > max && candle.closeAverage > 0) {
          max = candle.closeAverage;
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
      this.dataService.activeCandle.next(this.data.get(ev.layerX));
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

  resize(event) {
    this.appService.notifyChartResize({ id: this.id, width: -1, height: -1});
    if (this.currentZoomValue < 50) { this.currentZoomValue = 100; } else { this.currentZoomValue = 40; }
    event.stopPropagation();
  }

  onChange(value: number) {
    this.currentZoomValue = value;
    this.draw();
  }

}
