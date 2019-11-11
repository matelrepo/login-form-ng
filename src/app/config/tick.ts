export interface Tick {

  id: number
  timestamp: number
  close: number
  idcontract: number
  triggerUp: number
  triggerDown: number
  discarded: boolean
}
