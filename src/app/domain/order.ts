export class Order{
  id?: number
  idcontract: number =2
  quantity: number
  quantityFilled: number
  orderType: string
  freq: number
  auxPrice: number
  lmtPrice: number
  priceFilled: number
  status: string = "ApiPending"
  timestamp: Date
  manual: boolean = false

  constructor(){}
}
