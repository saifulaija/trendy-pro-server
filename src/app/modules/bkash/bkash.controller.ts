import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bkashServices } from "./bkash.service";

const createPayment=catchAsync(async(req,res)=>{
    console.log(req.body)

    const result = await bkashServices.createPayment(req.body)
    sendResponse(res,{
        success:true,
        message:'payment created successfully',
        statusCode:httpStatus.OK,
        data:result
    })
})

export const bkashControllers={
    createPayment
}