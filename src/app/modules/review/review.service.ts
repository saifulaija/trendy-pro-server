

import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Product } from "../products/product.model";
import { TReview } from "./review.interface";
import { Review } from "./review.model";




const createReview = async (payload: TReview) => {
    try {
      const productId = payload.productId;
  
      // Create the review
      const createdReview = await Review.create(payload);
  
      // Extract the _id of the created review
      const reviewId = createdReview._id;
  
      // Update the product with the _id of the created review
      await Product.updateOne({ _id: productId }, {
        $push: { reviews: { reviewId: reviewId.toString() } }
      });
  
      return createdReview;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  };
  
  


const getAllReviews=async()=>{
    const result = await Review.find()
    return result
}







// const deleteReview = async (id: string) => {
//   // Find the review
//   const review = await Review.findById(id);

//   if (!review) {
//       console.log('Review not found');
//       return;
//   }

//   // Find the associated product
//   const product = await Product.findById(review.productId);

//   if (!product) {
//       console.log('Product not found');
//       return;
//   }

//   // Find the index of the review in the product's reviews array
//   const reviewIndex = product?.reviews?.findIndex((item) => item.reviewId.toString() === id);

//   if (reviewIndex === -1) {
//       console.log('Review not found in product');
//       return;
//   }

//   // Remove the review from the product's reviews array
//   product?.reviews?.splice(reviewIndex, 1);

//   // Save the product
//   await product.save();

//   // Delete the review document
//   await Review.findByIdAndDelete(id);

//   console.log('Review deleted successfully');
// }


const deleteReview = async (id: string) => {
  // Find the review
  const review = await Review.findById(id);

  if (!review) {
      throw new AppError(httpStatus.NOT_FOUND,'Review not found')
  }

  // Find the associated product
  const product = await Product.findById(review.productId);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND,'Review not found')
  }

  // Find the index of the review in the product's reviews array
  const reviewIndex = product?.reviews?.findIndex((item) => item.reviewId.toString() === id);

  if (reviewIndex === -1) {
    throw new AppError(httpStatus.NOT_FOUND,'Review not found in product')
  }

  // Remove the review from the product's reviews array
  if (product.reviews) {
      product.reviews.splice(reviewIndex as number, 1);
  }

  // Save the product
  await product.save();

  // Delete the review document
 const result =  await Review.findByIdAndDelete(id);

  return result
}







  export const reviewServices={
    createReview,
    getAllReviews,
    deleteReview
  }