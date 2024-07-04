import { Schema, model } from 'mongoose';
import { TOrder, TProductOrder } from './order.interface';
const ProductItemSchema = new Schema<TProductOrder>({
  productId: {
    type: Schema.Types.ObjectId,
    
    required: true,
  },
  selectedQuantity: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  size:{
    type:String,
    required:true
  },
  discount:{
  type:Number,
  required:true
  },
  name:{
  type:String,
  required:true
  },
  price: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new Schema<TOrder>({
  buyerName: {
    type: String,
    required: true,
  },
  
  buyerEmail: {
    type: String,
    required: true,
  },
 orderDate: {
    type: String,
    required: true,
  },
 paymentSystem: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
 
 additionalInfo:{
    type:String,
    required:true
 },
 address:{
    type:String,
    required:true
 },
 mobile:{
    type:Number,
    required:true
 },
 
  deliveryStatus: {
    type: String,
    default: 'processing',
  },
  orderProduct: {
    type: [ProductItemSchema],
    required: true,
  },
  orderNumber:{
    type:String,
    required:true
  }
},
{
  timestamps: true,
},
);

export const Order = model<TOrder>('order', OrderSchema);
