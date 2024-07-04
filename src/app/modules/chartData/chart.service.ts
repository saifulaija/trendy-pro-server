import { Product } from './../products/product.model';
import { Order } from './../order/order.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../User/user.model';

const getCategoryChartData = async () => {
  const categories = ['man', 'women', 'kid'];

  const categoryData = [];

  for (const category of categories) {
    const count = await Product.countDocuments({ category });

    categoryData.push({ category, count });
  }

  return categoryData;
};


const getEarningsData = async () => {
  try {
    // Grouping by month
    const monthlyResult = await Order.aggregate([
      {
        $match: {
          deliveryStatus: "delivered"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$updatedAt" },
            month: { $month: "$updatedAt" }
          },
          total: { $sum: "$totalPrice" }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    // Grouping by year
    const yearlyResult = await Order.aggregate([
      {
        $match: {
          deliveryStatus: "delivered"
        }
      },
      {
        $group: {
          _id: { $year: "$updatedAt" },
          total: { $sum: "$totalPrice" }
        }
      },
      {
        $sort: {
          "_id": 1
        }
      }
    ]);

    return { monthlyResult, yearlyResult };
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Error mama found!!');
  }
};

const utilsInfo = async () => {
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalSoldItem = await Order.countDocuments({ deliveryStatus: "delivered" });
  
  // Using aggregation to calculate totalSoldMoney
  const totalSoldMoneyAggregate = await Order.aggregate([
    { $match: { deliveryStatus: "delivered" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);
  const totalSoldMoney = totalSoldMoneyAggregate.length > 0 ? totalSoldMoneyAggregate[0].total : 0;

  const result = {
    totalProducts,
    totalUsers,
    totalOrders,
    totalSoldItem,
    totalSoldMoney
  };

  return result;
};



export const chartService = {
  getCategoryChartData,
  getEarningsData,
  utilsInfo
};
