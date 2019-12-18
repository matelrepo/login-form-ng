import {Contract} from './contract';

export class Position{
   symbol: string
   quantity: number
   marketPrice: number
   marketValue: number
   averageCost: number
   unrealizedPnl: number
   realizedPnl: number
   dailyPnl: number
   connected: boolean
}
