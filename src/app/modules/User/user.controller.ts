import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';
import { TUser } from './user.interface';

const createUser = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user is created successfully',
    data: result,
  });
});
const getAllUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUser();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user is fetched successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = req.user as TUser;

  const result = await UserServices.getMe(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved successfully',
    data: result,
  });
});




const getUserDashboardData = catchAsync(async (req, res) => {
  const { email } = req.params;

  const result = await UserServices.getUserDashboardData(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard Data fetched successfully!!!',
    data: result,
  });
});




export const UserControllers = {
  createUser,
  getAllUser,
  getMe,
  getUserDashboardData,

};
