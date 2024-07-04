import { RequestHandler } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { chartService } from "./chart.service";

const getCategoryChartData: RequestHandler = catchAsync(async (req, res) => {
   
    const result = await chartService.getCategoryChartData();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'product chart retrieved successfully',
      data: result,
    });
  });
const getEarningsData: RequestHandler = catchAsync(async (req, res) => {
   
    const result = await chartService.getEarningsData();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Total earning data retrieved successfully',
      data: result,
    });
  });
const utilsInfo: RequestHandler = catchAsync(async (req, res) => {
   
    const result = await chartService.utilsInfo();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'utilsInfo retrieved successfully',
      data: result,
    });
  });

  export const chartController = {
    getCategoryChartData,
    getEarningsData,
    utilsInfo
  }