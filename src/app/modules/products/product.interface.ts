import { Types } from 'mongoose';

export type TProductSizeStok = {
  size: string;
  stock: number;
};

export type Treviews = {
  reviewId: Types.ObjectId;
};

export type TProduct = {
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  model: string;
  material: string;
  productType: string;
  tag?: string;
  productCode?: string;
  isDeleted?: boolean;
  reviews?: Treviews[];
  sellsQuantity?: number;
  subCategory: string;
  discount?: number;
  sizeStok: TProductSizeStok[];
  selectedSize?: string;
};
