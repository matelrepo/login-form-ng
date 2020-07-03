export interface ProcessorState {
  id: number
  idcontract: number
  freq: number
  idcandle: number
  idtick: number
  eventType: string
  eventsList: string
  eventsTradableList: string
  color: number
  value: number
  target: number
  isTradable: boolean
  timestampCandle: Date
  timestampTick: Date
  Evtype: string
  open: number
  high: number
  low: number
  close: number
  checkpoint: boolean
  averageClose: number
  abnormalHeight: number
  createdOn: Date
  updatedOn: Date
  minTrend: boolean
  maxTrend: boolean
  maxValue: number
  maxValid: number
  max: number
  minValue: number
  minValid: number
  min: number
  newCandle: boolean
  smallCandleNoiseRemoval: boolean

}
