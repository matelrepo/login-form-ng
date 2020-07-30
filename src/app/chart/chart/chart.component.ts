import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef, AfterViewInit, Input, HostListener
} from '@angular/core';
import {Subscription} from 'rxjs';
import {Candle} from '../../domain/candle';
import {Contract} from '../../domain/contract';
import {DataService} from '../../service/data.service';
import {AppService} from '../../service/app.service';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private dataService: DataService,
              private app: AppService) {
  }

  private activeContractSubscription: Subscription = new Subscription()
  private activeContract: Contract
  private liveDataSubscription: Subscription = new Subscription()

  private dragStart = 0
  private dragEnd = 0
  private dragCumul = 0
  private isDrag = false

  @Input() freq
  @Input() idcontract
  @ViewChild('chartRef', {static: false}) canvasRef: ElementRef
  canvas: HTMLCanvasElement
  private gc: CanvasRenderingContext2D

  private break: boolean = false;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    if (event.code === 'KeyP') {
      this.break = !this.break;
      if (this.candles.length > 0){
        this.dataService.reqDataBreak( this.break).subscribe();
        console.log('break')
      }
    }
  }

  private widthCandle = 6
  private min
  private max
  private candles: Candle[] = []
  private currentZoomValue = 1200
  private data = new Map()
  private colorCandle = '#767676'
  private colorBigCandle = 'khaki'


  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.gc = this.canvas.getContext('2d');
    this.draw();
  }

  ngOnInit() {
    this.activeContractSubscription = this.dataService.activeContract$
        .subscribe(contract => {
          this.activeContract = contract;
          this.candles = [];
          this.draw();
          this.subscribeHisto();
        });
  }

  subscribeLive() {
    this.liveDataSubscription.unsubscribe();
    this.liveDataSubscription = this.dataService.getLiveTicks(this.activeContract.idcontract, this.freq).subscribe(mes => {
      const candle: Candle = JSON.parse(mes.body);
      if (this.freq === candle.freq && this.candles.length > 0) {
        if (candle.id !== this.candles[0].id) {
          this.candles.unshift(candle); //new candle
        } else {
          this.candles[0] = candle; //update existing candle
        }
        if (this.candles.length > this.app.numCappedHistoricalCandles)
          this.candles.pop();
        this.draw();
      }
    });
  }

  subscribeHisto() {
    this.liveDataSubscription.unsubscribe();
    this.dataService.getHistoCandles(this.activeContract.idcontract, this.activeContract.symbol, this.freq)
      .subscribe(candles => {
        this.candles = candles;
        this.draw();
        if (this.activeContract.idcontract < 10000)
          this.subscribeLive();
      });
  }

  ngOnDestroy() {
    this.activeContractSubscription.unsubscribe();
    this.liveDataSubscription.unsubscribe();
  }

  draw() {
    if (this.candles != null) {
      if (this.canvas !== undefined) {
        this.data = new Map();
        this.gc.fillStyle = '#ebe8e1';
        this.gc.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.gc.fillStyle = '#141414';
        this.gc.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        this.min = this.getTrailingMin(this.currentZoomValue);
        this.max = this.getTrailingMax(this.currentZoomValue);

        let x = 1 - this.dragEnd;

        for (const candle of this.candles) {
          if (candle.color === 1) {
            this.colorCandle = 'limegreen';
            this.colorBigCandle = 'limegreen'
          } else if (candle.color > 1) {
            this.colorCandle = 'greenyellow';
            this.colorBigCandle = 'greenyellow'
          } else if (candle.color === -1) {
            this.colorCandle = 'red';
            this.colorBigCandle = 'red'
          } else if (candle.color < -1) {
            this.colorCandle = 'firebrick';
            this.colorBigCandle = 'firebrick'
          }else{
            this.colorCandle = '#767676';
            this.colorBigCandle = '#767676'
          }

          if (candle.bigCandle)
            this.colorBigCandle = 'khaki'

          const time = this.getX(x)
          candle.canvax = time
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

          this.gc.strokeStyle = 'white';
          this.gc.beginPath();
          this.gc.moveTo(time + this.widthCandle / 2, high);
          this.gc.lineTo(time + this.widthCandle / 2, low);
          this.gc.stroke();

          this.gc.strokeStyle = 'blueviolet';
          this.gc.beginPath();
          this.gc.moveTo(time, this.getYPixel(candle.averageClose));
          this.gc.lineTo(time + this.widthCandle, this.getYPixel(candle.averageClose));
          this.gc.stroke();


          if (candle.open <= candle.close) {
            this.gc.fillStyle = this.colorBigCandle
            this.gc.fillRect(time, close, this.widthCandle, open - midPrice)
            this.gc.fillStyle = this.colorCandle
            this.gc.fillRect(time, close + open - midPrice, this.widthCandle, open - (close + open - midPrice))
          } else {
            this.gc.fillStyle = this.colorCandle
            this.gc.fillRect(time, open, this.widthCandle, close - midPrice)
            this.gc.fillStyle = this.colorBigCandle
            this.gc.fillRect(time, open + close - midPrice, this.widthCandle, close - (open + close - midPrice))
          }
          x += 1;
        }


        if (this.candles.length > 0) {
          this.gc.strokeStyle = 'green';
          this.gc.beginPath();
          this.gc.moveTo(0, this.getYPixel(this.candles[0].resistanceLevel));
          this.gc.lineTo(1000, this.getYPixel(this.candles[0].resistanceLevel));
          this.gc.stroke();

          this.gc.strokeStyle = 'red';
          this.gc.beginPath();
          this.gc.moveTo(0, this.getYPixel(this.candles[0].supportLevel));
          this.gc.lineTo(1000, this.getYPixel(this.candles[0].supportLevel));
          this.gc.stroke();

          this.gc.strokeStyle = 'blue';
          this.gc.beginPath();
          this.gc.moveTo(0, this.getYPixel(this.candles[0].lowestLow) + 3);
          this.gc.lineTo(1000, this.getYPixel(this.candles[0].lowestLow) + 3);
          this.gc.stroke();

          this.gc.strokeStyle = 'orange';
          this.gc.beginPath();
          this.gc.moveTo(0, this.getYPixel(this.candles[0].highestHigh) + 3);
          this.gc.lineTo(1000, this.getYPixel(this.candles[0].highestHigh) + 3);
          this.gc.stroke();
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
    const pct = (this.currentZoomValue) / (this.canvas.clientWidth);
    return this.canvas.clientWidth - v / pct - 20;
  }

  getTrailingMin(numDays) {
    let min = Number.MAX_VALUE;
    let i = 1 - this.dragEnd;
    this.candles.forEach(candle => {
      if (i < numDays) {
        if (candle.low < min) {
          min = candle.low;
        }
        if (candle.averageClose < min && candle.averageClose > 0) {
          min = candle.averageClose;
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
        if (candle.averageClose > max && candle.averageClose > 0) {
          max = candle.averageClose;
        }
      }
      i++;
    });
    return max;
  }

  onClickZoomMore() {
    this.currentZoomValue = this.currentZoomValue + 10;
    this.draw();
  }

  onClickZoomLess() {
    this.currentZoomValue = this.currentZoomValue - 10;
    this.draw();
  }

  onMouseMove(ev: MouseEvent) {
    if (this.isDrag) {
      this.dragEnd = this.dragCumul + ev.clientX - this.dragStart;
      this.draw();
    }
    let mouseX = ev.pageX - this.canvas.getBoundingClientRect().left
    mouseX /= this.canvas.getBoundingClientRect().width;
    mouseX *= this.canvas.width;
    mouseX = Math.round(mouseX)

    if (this.data.get(mouseX)) {
      const open = this.getYPixel(this.data.get(mouseX).open);
      const close = this.getYPixel(this.data.get(mouseX).close);
      const midPrice = this.getYPixel((this.data.get(mouseX).open + this.data.get(mouseX).close) / 2);
      this.draw();
      this.gc.fillStyle = 'lightgray'
      this.gc.fillRect(this.data.get(mouseX).canvax, close, this.widthCandle, open - midPrice)
      this.gc.fillStyle = 'lightgray'
      this.gc.fillRect(this.data.get(mouseX).canvax, close + open - midPrice, this.widthCandle, open - (close + open - midPrice))
      this.dataService.activeCandle.next(this.data.get(mouseX))
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
}
