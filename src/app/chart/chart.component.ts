import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter, AfterViewInit, Input, OnChanges, DoCheck, HostListener
} from '@angular/core';
import {Message} from '@stomp/stompjs';
import {Subscription, Subject, Observable, of} from 'rxjs';
import {Candle} from '../config/candle';
import {Contract} from '../config/contract';
import {DataService} from '../service/data.service';
import {AppService} from '../service/app.service';
import {GlobalSettings} from '../config/globalSettings';
import set = Reflect.set;


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private dataService: DataService, private appService: AppService) {
  }

  private activeContractSub: Subscription;
  private liveSub$: Subscription;
  private liveHisto$: Subscription;
  private chartChange$: Subscription;

  @Input() freq;
  @Input() id;
  @ViewChild('chartRef', {static: false}) canvasRef: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.onMouseDblClick()
  }

  canvas: HTMLCanvasElement;
  private gc: CanvasRenderingContext2D;
  private widthCandle = 6;
  private width = 10;
  private min;
  private max;
  private candles: Candle[] = [];
  private currentZoomValue = 30;
  private data = new Map();
  private colorUp = 'lightgreen';
  private colorDown = '#ff0000';
  private colorMat = '#FF2FC5';
  private dragStart = 0;
  private dragEnd = 0;
  private dragCumul = 0;
  private isDrag = false;
  private activeContract: Contract;

  @HostListener('window:resize', ['$event'])
  onR(event) {
   this.init()
  }

  private globalSetting: GlobalSettings = {idcontract: -1, freq: -1, email: false, voice: false, trade: false};

  ngAfterViewInit() {
    this.init();
  }

  init() {
    if (this.canvasRef !== undefined) {
      this.canvas = this.canvasRef.nativeElement;
      this.gc = this.canvas.getContext('2d');
      // this.canvasRef.nativeElement.style.width = '100%';
      // this.canvasRef.nativeElement.style.height = '100%';
   //   console.log(this.canvasRef)
   //   console.log(this.canvas.clientWidth + ' ' + this.canvas.clientHeight)
      this.draw();
    }
  }


  ngOnInit() {
    this.dataService.activeContract$.subscribe(contract => {
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

    // this.dataService.getGlobalSettings(this.activeContract.idcontract).subscribe(settings => {
    //   Object.values(settings).forEach((setting) => {
    //     if (this.freq === setting.freq) {
    //     this.globalSetting.idcontract = setting.idcontract;
    //     this.globalSetting.freq = setting.freq;
    //     this.globalSetting.email = setting.email;
    //     this.globalSetting.voice = setting.voice;
    //     this.globalSetting.trade = setting.trade;
    //   }
    //   });
    // });
  }

  // onClickEmailChange(change) {
  //   // console.log(change);
  //   this.globalSetting.email = change;
  //   this.dataService.setGlobalSettings(this.globalSetting).subscribe();
  // }
  // onClickVoiceChange(change) {
  //   this.globalSetting.voice = change;
  //   this.dataService.setGlobalSettings(this.globalSetting).subscribe();  }
  //
  // onClickTradeChange(change) {
  //   this.globalSetting.trade = change;
  //   this.dataService.setGlobalSettings(this.globalSetting).subscribe();  }

  subscribeLive() {
    if (this.liveHisto$ !== undefined) {
      this.liveHisto$.unsubscribe();
    }
    if (this.liveSub$ !== undefined) {
      this.liveSub$.unsubscribe();
    }
    this.liveSub$ = this.dataService.getLiveTicks(this.activeContract.idcontract, this.freq).subscribe(mes => {
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
        this.gc.fillStyle = '#ebe8e1';
        this.gc.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.gc.fillStyle = 'black';
        this.gc.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        this.min = this.getTrailingMin(this.currentZoomValue);
        this.max = this.getTrailingMax(this.currentZoomValue);

        let x = 1 - this.dragEnd;
        for (const candle of this.candles) {
          if (candle.color === 1) {
            // this.colorUp = 'lightgreen';
            // this.colorDown = 'lightgreen';
            // this.colorMat = 'lightgreen';
            this.colorUp = 'limegreen';
            this.colorDown = 'limegreen';
            this.colorMat = 'limegreen';
          } else if (candle.color === 2) {
            this.colorUp = 'greenyellow';
            this.colorDown = 'greenyellow';
            this.colorMat = 'greenyellow';
          } else if (candle.color > 2) {
            // this.colorUp = 'yellow';
            // this.colorDown = 'yellow';
          } else if (candle.color === -1) {
            // this.colorUp = 'salmon';
            // this.colorDown = 'salmon';
            // this.colorMat = 'salmon';
            this.colorUp = 'red';
            this.colorDown = 'red';
            this.colorMat = 'red';
          } else if (candle.color === -2) {
            this.colorUp = 'firebrick';
            this.colorDown = 'firebrick';
            this.colorMat = 'firebrick';
          } else if (candle.color < -2) {
            // this.colorUp = 'orange';
            // this.colorDown = 'orange';
          } else {
            this.colorUp = '#767676';
            this.colorDown = '#767676';
            this.colorMat = '#767676';
          }

          if (candle.bigCandle) {
            this.colorMat = 'khaki';
          }


          const time = this.getX(x);
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
          this.gc.moveTo(time, this.getYPixel(candle.closeAverage));
          this.gc.lineTo(time + this.widthCandle, this.getYPixel(candle.closeAverage));
          this.gc.stroke();

          if (candle.open <= candle.close) {
            this.gc.fillStyle = this.colorMat;
            this.gc.fillRect(time, close, this.widthCandle, open - midPrice);
            this.gc.fillStyle = this.colorUp;
            this.gc.fillRect(time, close + open - midPrice, this.widthCandle, open - (close + open - midPrice));
          } else {
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
    const pct = (this.currentZoomValue * this.width) / (this.canvas.clientWidth);
   // console.log(v + ' ' + (this.canvas.clientWidth - v / pct +20))
    return this.canvas.clientWidth - v / pct -20;
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
   let mouseX = ev.pageX - this.canvas.getBoundingClientRect().left
    mouseX /=  this.canvas.getBoundingClientRect().width;
    mouseX *= this.canvas.width;
    mouseX = Math.round(mouseX)
  //  console.log(mouseX)

    if (this.data.get(mouseX))
      this.dataService.activeCandle.next(this.data.get(mouseX));
  }

  onMouseDown(ev: MouseEvent) {
    this.isDrag = true;
    this.dragStart = ev.clientX;
   // console.log('down')
  }

  onMouseUp() {
    if (this.isDrag) {
      this.dragCumul = this.dragEnd;
      this.isDrag = false;
    }
   // console.log('down')

  }

  onMouseDblClick() {
    this.dragCumul = 0;
    this.dragEnd = 0;
    this.draw();
  }

  // resize(event) {
  //   this.appService.notifyChartResize({id: this.id, width: -1, height: -1});
  //   if (this.currentZoomValue < 50) {
  //     this.currentZoomValue = 100;
  //   } else {
  //     this.currentZoomValue = 40;
  //   }
  //   event.stopPropagation();
  //   console.log('resizing chart')
  //   this.onMouseDblClick()
  // }

  // onChange(value: number) {
  //   this.currentZoomValue = value;
  //   this.draw();
  // }

}
