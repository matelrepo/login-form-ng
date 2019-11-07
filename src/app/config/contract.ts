export interface Contract{
  id: number;
  title: string;
  exchange: string;
  currency: string;
  symbol: string;
  tickSize: number;
  multiplier: string;
  expiration: string;
  firstNotice: string;
  active: boolean;
  flowType: string;
  fusion: number;
}
