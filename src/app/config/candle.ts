export class Candle {

  constructor(idcontract: number, freq: number) {
    this.idcontract = idcontract;
    this.freq = freq;
  }

  id: number;
  idtick: number;
  timestampTick: Date;
  timestampCandle: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  idcontract: number;
  freq: number;
  color: number;
  trigger_up: number;
  trigger_down: number;
  newCandle: boolean;
  speed: number;
  progress: number;
  closeAverage: number;
  abnormalHeightLevel: number;
  bigCandle: boolean

}
