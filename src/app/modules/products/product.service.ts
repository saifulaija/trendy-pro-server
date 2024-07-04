import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { productSearchableFields } from './product.constant';
import { TProduct } from './product.interface';
import { Product } from './product.model';

const createProductIntoDB = async (payload: TProduct) => {
  const result = await Product.create(payload);
  return result;
};

const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(
    Product.find({ isDeleted: false }),
    query,
  )
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleProductFromDB = async (id:string) => {
  try {
    const result = await Product.aggregate([
      {$match: {_id:new mongoose.Types.ObjectId(id)}},

      // 1st stage: Lookup reviews collection
      {
        $lookup: {
          from: 'reviews',
          localField: 'reviews.reviewId',
          foreignField: '_id',
          as: 'reviews',
        },
      },
      // 2nd stage: Calculate average rating
      {
        $addFields: {
          averageRating: { $avg: '$reviews.rating' },
        },
      },
    ]);

    return result;
  } catch (error) {
    console.error('Error fetching products and reviews:', error);
    throw error;
  }
};

const getAllProductsByCategoryFromDB = async (category: string) => {
  let result;

  // Determine the field based on the presence of category, subCategory, or productType in any product
  const field = (await Product.exists({ category }))
    ? 'category'
    : (await Product.exists({ subCategory: category }))
      ? 'subCategory'
      : 'productType';

  // Build the query based on the determined field
  let query = {};
  switch (field) {
    case 'category':
      query = { category };
      break;
    case 'subCategory':
      query = { subCategory: category };
      break;
    case 'productType':
      query = { productType: category };
      break;
    default:
      throw new Error('Invalid field');
  }

  // Execute the query using the QueryBuilder pattern
  const productQuery = new QueryBuilder(
    Product.find().where(query), // Pass both the initial query and the query object
    {},
  )
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  // Execute the model query
  const { modelQuery } = productQuery;
  result = await modelQuery;

  // Count total records for pagination
  const meta = await productQuery.countTotal();

  // Return the result along with meta information
  return { meta, result };
};

const updateProductIntoDB = async (id: string, payload: Partial<TProduct>) => {
  const { sizeStok, ...remainingProductData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingProductData,
  };

  if (sizeStok && Array.isArray(sizeStok) && sizeStok.length > 0) {
    const sizeStockObject: Record<string, unknown> = {};

    sizeStok.forEach((item, index) => {
      sizeStockObject[`sizeStok.${index}.size`] = item.size;
      sizeStockObject[`sizeStok.${index}.stock`] = item.stock;
    });

    modifiedUpdatedData['$set'] = sizeStockObject;
  }

  const result = await Product.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteProductIntoDB = async (id: string) => {
  const result = await Product.findOneAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  updateProductIntoDB,
  getSingleProductFromDB,
  getAllProductsByCategoryFromDB,
  deleteProductIntoDB,
};
