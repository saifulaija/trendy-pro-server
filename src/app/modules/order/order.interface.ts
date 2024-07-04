import { Types } from 'mongoose';

export type TProductOrder = {
  productId: Types.ObjectId;
  selectedQuantity: number;
  image: string;
  price: number;
  name:string,
  discount:number,
  size:string
};

export type TOrder = {
  buyerName: string;
  buyerEmail: string;
  address: string;
  mobile: number;
  additionalInfo: string;
  totalPrice: number;
  paymentSystem: string;
  orderNumber: string;
  orderDate: string;
  deliveryStatus?: string;
  orderProduct: TProductOrder[];
};
