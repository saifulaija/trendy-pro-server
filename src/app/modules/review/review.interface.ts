import { Types } from "mongoose";

export type TReview={
    name:string;
    rating:number;
    description:string
    productId:Types.ObjectId;
    isDeleted?:boolean
}