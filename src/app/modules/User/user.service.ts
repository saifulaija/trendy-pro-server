/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';

import { TUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import { Order } from '../order/order.model';
import { DashboardData } from './user.constant';

const createUserIntoDB = async (payload: TUser) => {
  // console.log({payload})
  const isExistUser = await User.findOne({ email: payload.email });

  if (isExistUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This email already exists');
  }

  const result = await User.create(payload);
  return result;
};
const getAllUser = async()=>{
  const result  =  await User.find()
  return result;
}


const getMe = async (user: TUser) => {
  // console.log(user)
  const result = await User.findOne({ email: user?.email, role: user?.role });
  // let result = null;
  // if (role === 'student') {
  //   result = await Student.findOne({ id: userId }).populate('user');
  // }
  // if (role === 'admin') {
  //   result = await Admin.findOne({ id: userId }).populate('user');
  // }

  // if (role === 'faculty') {
  //   result = await Faculty.findOne({ id: userId }).populate('user');
  // }

  return result;
};






const getUserDashboardData = async (email: string): Promise<DashboardData> => {
  const orders = await Order.find({ buyerEmail: email });

  let totalShoppingAmount = 0;
  let totalProductsBought = 0;
  let totalProductsCancelled = 0;
  let totalRewardsPoints = 0;

 
  orders.forEach((order) => {
    if (order.deliveryStatus === 'delivered') {
      totalShoppingAmount += order.totalPrice;
      totalProductsBought += order.orderProduct.reduce(
        (acc, product) => acc + product.selectedQuantity,
        0,
      );
      totalRewardsPoints += order.orderProduct.reduce(
        (acc, product) => acc + product.selectedQuantity + 10,
        0,
      );
    } else if (order.deliveryStatus === 'cancel') {
      totalProductsCancelled += order.orderProduct.reduce(
        (acc, product) => acc + product.selectedQuantity,
        0,
      );
    }
  });






  return {
    totalShoppingAmount,
    totalProductsBought,
    totalProductsCancelled,
    totalRewardsPoints,

  };
};









export const UserServices = {
  createUserIntoDB,
  getAllUser,
  getMe,
  getUserDashboardData,
};
