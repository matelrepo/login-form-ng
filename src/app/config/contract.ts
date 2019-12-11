export interface Contract{
  idcontract: number;
  title?: string;
  exchange?: string;
  currency?: string;
  symbol: string;
  tickSize?: number;
  multiplier?: string;
  expiration?: Date;
  firstNotice?: string;
  active?: boolean;
  flowType?: string;
  fusion?: number;

}
