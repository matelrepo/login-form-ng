export class Order{
  id?: number
  idcontract: number =2
  quantity: number
  orderType: string
  frequency: number
  price: number
  priceFilled: number
  status: string = "ApiPending"
  username: string = "matel"

  constructor(){}
}
