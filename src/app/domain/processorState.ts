export interface ProcessorState {
  id: number
  idcontract: number
  symbol: string
  freq: number
  idtick: number
  eventType: string
  value: number
  target: number
  isTradable: boolean
  checkpoint: boolean
  timestampTick: Date
  resistance: boolean
  support: boolean

}
