import {Position} from './position';

export class Portfolio{
  initMarginReq: number
  maintMarginReq: number
  netLiquidation: number
  dailyPnl: number
  realizedPnl: number
  unrealizedPnl: number
  excessLiq: number
  lastUpdate: number
  positions: Map<number, Position>
}
