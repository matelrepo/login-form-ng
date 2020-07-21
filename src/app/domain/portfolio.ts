import {Position} from './position';

export class Portfolio{
  maintenance: number
  netLiquidation: number
  dailyPnl: number
  realizedPnl: number
  unrealizedPnl: number
  excessLiquidity: number
  positions: Position[] =[]
  mark: number
}
