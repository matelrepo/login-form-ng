export class Candle {

  constructor(idcontract: number, freq: number) {
    this.idcontract = idcontract;
    this.freq = freq;
  }

  idcandle: number;
  open: number;
  high: number;
  low: number;
  close: number;
  trigger_up: number;
  trigger_down: number;
  timestamp: Date;
  idcontract: number;
  isOpen: boolean;
  freq: number;
  oldFreq: number = 0;
  speed: number;
  newCandle: boolean;
  average: number;
  color: number;
  resistance: number;
  support: number;
  lowestMin: number;
  highestMax: number;
  progress: number;
}
