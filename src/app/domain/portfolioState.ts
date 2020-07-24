import {Position} from './position';

export class PortfolioState{
  idcontract: number
  maintenance: number
  netLiquidation: number
  dailyPnl: number
  realizedPnl: number
  unrealizedPnl: number
  excessLiquidity: number
  positions: Position[] =[]
  mark: number
  margin:number
}
