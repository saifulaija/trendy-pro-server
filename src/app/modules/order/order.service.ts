/* eslint-disable @typescript-eslint/no-explicit-any */

import { Order } from './order.model';
import { sendEmail } from '../../utils/sendEmail';
import { Product } from '../products/product.model';

// const createOrderIntoDB = async (payload: TOrder) => {
//   const result = await Order.create(payload);
//  //send email with invoice
// const orderUI =  `

// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Invoice</title>
// </head>
// <body style="background-color: #f3f4f6; padding: 20px; font-family: Arial, sans-serif;">
// <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
//     <div style="background-color: #a1a1a136;padding-left: 20px;  padding-right: 20px; padding-top: 30px; border-radius: 15px;">
//         <div style="text-align: center; margin-bottom: 20px;">
//             <div style="background-color: #f3f4f6; padding: 20px; margin-bottom: 10px;">
//               <img src="https://i.ibb.co/HqRBG9S/PNG-Richkid-Logo.png" alt="logo">
//             </div>
//               <h2 style="font-size: 24px; font-weight: bold; margin: 0;">Invoice</h2>
//               <p style="font-size: 14px; color: #7a7a7a; margin-top: 5px;">Order ID# 438904</p>
//           </div>

//           <div style="margin-bottom: 20px;">
//               <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Shipping Address</h3>
//               <p style="font-size: 14px; color: #333333; margin: 0;">${payload?.buyerName}</p>
//               <p style="font-size: 14px; color: #333333; margin: 0;">${payload?.address}</p>

//               <p style="font-size: 14px; color: #333333; margin: 0;">Phone: ${payload?.mobile}</p>
//               <p style="font-size: 14px; color: #333333; margin: 0;">Email: ${payload?.buyerEmail}</p>
//           </div>

//           <div style="margin-bottom: 20px;">
//               <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Order Summary</h3>
//               <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
//                   <tbody>
//                       <tr>
//                           <td style="padding: 8px 0;">Payment Method:</td>
//                           <td style="padding: 8px 0;">Cash on Delivery</td>
//                       </tr>
//                       <tr>
//                           <td style="padding: 8px 0;">Shipping Method:</td>
//                           <td style="padding: 8px 0;">Home Delivery</td>
//                       </tr>
//                       <tr>
//                           <td style="padding: 8px 0;">Sub-Total:</td>
//                           <td style="padding: 8px 0;">${payload?.totalPrice} <span style="font-size: 8px;" > (+ included delivery charge ) </span></td>
//                       </tr>

//                       <tr>
//                           <td style="padding: 8px 0; border-top: 1px solid #e0e0e0; font-weight: bold;">Total:</td>
//                           <td style="padding: 8px 0; border-top: 1px solid #e0e0e0; font-weight: bold;">${payload?.totalPrice}</td>
//                       </tr>
//                   </tbody>
//               </table>
//           </div>

//     </div>
//         <div>
//             <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Products</h3>
//             <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
//                 <thead>
//                     <tr>
//                         <th style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">Product</th>
//                         <th style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">Quantity</th>
//                         <th style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">Total</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${payload.orderProduct
//                       .map(
//                         (product) => `
//                         <tr>
//                             <td style="padding: 8px 0;">${product.name}</td>
//                             <td style="padding: 8px 0;">${product.selectedQuantity}</td>
//                             <td style="padding: 8px 0;">${product.price}</td>
//                         </tr>
//                     `,
//                       )
//                       .join('')}
//                 </tbody>
//             </table>
//         </div>
//     </div>
// </body>
// </html>
// `

//   sendEmail(payload.buyerEmail ,"Your order at Richkid Shoes has been received!" ,orderUI );
//   return result;
// };

export type TProductOrder = {
  productId: string;
  selectedQuantity: number | undefined;
  image: string;
  price: number;
  name: string;
  discount: number;
  size: string;
};

export type TOrder = {
  buyerName: string;
  buyerEmail: string;
  address: string;
  mobile: number;
  additionalInfo: string;
  totalPrice: number;
  paymentSystem: string;
  orderNumber: string;
  orderDate: string;
  deliveryStatus?: string;
  orderProduct?: TProductOrder[];
};

const createOrderIntoDB = async (payload: TOrder): Promise<any> => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const result = await Order.create(payload);

    // Updating product stock and sell quantities
    const orderProducts = payload.orderProduct || [];
    for (const orderProduct of orderProducts) {
      const product = await Product.findById(orderProduct.productId);

      if (!product) {
        throw new Error(`Product with ID ${orderProduct.productId} not found`);
      }

      if (!product.sizeStok) {
        throw new Error(
          `Size stock is not initialized for product ${product._id}`,
        );
      }

      const sizeStock = product.sizeStok.find(
        (stock) => stock.size === orderProduct.size,
      );

      if (!sizeStock) {
        throw new Error(
          `Stock for size ${orderProduct.size} not found for product ${product._id}`,
        );
      }

      // Update sell quantity
      if (product.sellsQuantity !== undefined) {
        product.sellsQuantity += orderProduct.selectedQuantity || 0;
      } else {
        product.sellsQuantity = orderProduct.selectedQuantity || 0;
      }

      // Update stock
      sizeStock.stock -= orderProduct.selectedQuantity || 0;

      if (sizeStock.stock < 0) {
        throw new Error(
          `Stock for size ${orderProduct.size} cannot be negative for product ${product._id}`,
        );
      }

      await product.save();
    }

    const orderUI = `

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
    </head>
    <body style="background-color: #f3f4f6; padding: 20px; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #a1a1a136;padding-left: 20px;  padding-right: 20px; padding-top: 30px; border-radius: 15px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="margin-bottom: 10px;">
          <img src="https://i.ibb.co/44nNjQm/logo-dark.png" width="100" height="50" alt="logo">
        </div>
                  <h2 style="font-size: 24px; font-weight: bold; margin: 0;">Invoice</h2>
                  <p style="font-size: 14px; color: #7a7a7a; margin-top: 5px;">Order ID# 438904</p>
              </div>

              <div style="margin-bottom: 20px;">
                  <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Shipping Address</h3>
                  <p style="font-size: 14px; color: #333333; margin: 0;">${payload?.buyerName}</p>
                  <p style="font-size: 14px; color: #333333; margin: 0;">${payload?.address}</p>

                  <p style="font-size: 14px; color: #333333; margin: 0;">Phone: ${payload?.mobile}</p>
                  <p style="font-size: 14px; color: #333333; margin: 0;">Email: ${payload?.buyerEmail}</p>
              </div>

              <div style="margin-bottom: 20px;">
                  <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Order Summary</h3>
                  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                      <tbody>
                          <tr>
                              <td style="padding: 8px 0;">Payment Method:</td>
                              <td style="padding: 8px 0;">Cash on Delivery</td>
                          </tr>
                          <tr>
                              <td style="padding: 8px 0;">Shipping Method:</td>
                              <td style="padding: 8px 0;">Home Delivery</td>
                          </tr>
                          <tr>
                              <td style="padding: 8px 0;">Sub-Total:</td>
                              <td style="padding: 8px 0;">${payload?.totalPrice}৳ <span style="font-size: 8px;" > (+ included delivery charge ) </span></td>
                          </tr>

                          <tr>
                              <td style="padding: 8px 0; border-top: 1px solid #e0e0e0; font-weight: bold;">Total:</td>
                              <td style="padding: 8px 0; border-top: 1px solid #e0e0e0; font-weight: bold;">${payload?.totalPrice}৳</td>
                          </tr>
                      </tbody>
                  </table>
              </div>

        </div>
            <div>
                <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Products</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
                    <thead>
                        <tr>
                            <th style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">Product</th>
                            <th style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">Quantity</th>
                            <th style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">Price</th>
                            <th style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">Total</th>
                        </tr>
                    </thead>
               <tbody>
    ${payload?.orderProduct
      ?.map(
        (product: any) => `
                <tr>
                    <td style="padding: 8px 0;">${product.name}</td>
                    <td style="padding: 8px 0;">${product.selectedQuantity}</td>
                    <td style="padding: 8px 0;">${product?.price}৳</td>
                    <td style="padding: 8px 0;">${
                      product && product.price && product.selectedQuantity
                        ? product.price * product.selectedQuantity
                        : 'N/A'
                    }৳</td>
                </tr>
            `,
      )
      .join('')}
</tbody>

                </table>
            </div>

<div style="max-width: 600px; margin: 0 auto; padding: 20px;  margin-top: 30px ;">
  <p style="font-style: italic; font-size: 18px; text-align: center;">Thanks for your order.</p>
  <table align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center">
     <div style="margin-bottom: 10px;">
          <img src="https://i.ibb.co/44nNjQm/logo-dark.png" width=" 70" height="40" alt="logo">
        </div>
        <p style="font-size: 12px; text-align: center;">
          <strong>Trendy Leather BD</strong><br>
          5/4 Solimollah Road,<br>
          Mohammadpur, Dhaka-1207
        </p>
      </td>
    </tr>
  </table>
</div>
<p style="text-align: center; font-size: 14px; color: #666;">Copyright &copy; 2024 Trendy Leather BD. All rights reserved.</p>

        </div>
    </body>
    </html>
    `;

    await session.commitTransaction();
    await sendEmail(
      payload.buyerEmail,
      'Your order at Richkid Shoes has been received!',
      orderUI,
    );

    return result;
  } catch (error) {
    console.error('Error creating order:', error);
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllOrdersFromDB = async () => {
  const result = await Order.find().sort({ createdAt: -1 });

  return result;
};

const getSingleOrderFromDB = async (id: string) => {
  const result = await Order.findById(id);
  return result;
};
const getSingleOrderByOrderNumberFromDB = async (id: string) => {
  const result = await Order.findOne({ orderNumber: id });
  return result;
};

const updateOrderIntoDB = async (id: string, payload: Partial<TOrder>) => {
  const buyerData = await Order.findById(id);
  console.log(buyerData);
  const deliveryEmailData = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shipping Update</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 5px;">
    <h1 style="color: #333; font-size: 24px;">Shipping Update</h1>
    <p style="color: #666; font-size: 16px;">Dear ${buyerData?.buyerName},</p>
    <p style="color: #666; font-size: 16px;">Good news! Your order #${buyerData?.orderNumber} is on its way to you. Here are the details:</p>
    <div style="margin-top: 20px;">
      <p style="margin-bottom: 10px; color: #666; font-size: 16px;"><strong>Carrier:</strong> Pathao Courier </p>
      <p style="margin-bottom: 10px; color: #666; font-size: 16px;"><strong>Tracking Number:</strong> ${buyerData?.orderNumber}</p>
      <p style="margin-bottom: 10px; color: #666; font-size: 16px;"><strong>Estimated Delivery:</strong> within 3 working days</p>
    </div>
    <p style="color: #666; font-size: 16px;">Track your package using the provided tracking number. Any questions? Reach out to us at richkid@gmail.com or +80100000000.</p>
    <p style="color: #666; font-size: 16px;">Thank you for choosing RichKid Life Style.</p>
  </div>
</body>
</html>
`;

  const cancelationEmailBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Cancellation Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 20px auto; padding: 20px; ">
    <h1 style="color: #333; margin-bottom: 20px; font-size: 30px; ">Order Cancellation Confirmation</h1>
    <p style="color: #666; font-size: 16px; margin-bottom: 10px;">Dear #${buyerData?.buyerName},</p>
    <p style="color: #666; font-size: 16px; margin-bottom: 10px;">Your order #${buyerData?.orderNumber} has been canceled by you. Any payment made will be refunded within [Number of Days] business days.</p>
    <div style="margin-top: 20px;">
      <p style="color: #666; font-size: 16px; margin-bottom: 5px;">For assistance, contact us at <a href="mailto:richkid@gmail.com" style="color: #007bff; text-decoration: none;">richkid@gmail.com</a> or <a href="tel:+880000000" style="color: #007bff; text-decoration: none;">+880000000</a>.</p>
    </div>
    <p style="color: #666; font-size: 16px;">Thank you for your understanding.</p>
  </div>
</body>
</html>


`;

  const session = await Order.startSession();
  session.startTransaction();

  try {
    const result = await Order.findOneAndUpdate(
      { _id: id },
      { deliveryStatus: payload.deliveryStatus },
      { new: true, session },
    );

    await session.commitTransaction();

    // Check if result is not null before accessing its properties
    if (
      result &&
      result.deliveryStatus === 'shipped' &&
      buyerData?.buyerEmail
    ) {
      await sendEmail(
        buyerData.buyerEmail,
        `🚚 Shipping Update: Your Order [#${buyerData?.orderNumber} ]on RichKid LifeStyle 📦`,
        deliveryEmailData,
      );
    }
    if (
      result &&
      result.deliveryStatus === 'cancelled' &&
      buyerData?.buyerEmail
    ) {
      await sendEmail(
        buyerData.buyerEmail,
        `🚫 Order Cancellation:  Your Order [#${buyerData?.orderNumber} ] on RichKid LifeStyle 📦`,
        cancelationEmailBody,
      );
    }

    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getSuccessfulDelivery = async () => {
  const result = await Order.find({
    deliveryStatus: 'delivered',
  }).sort({ updatedAt: -1 });

  return result;
};

const getMyOrders = async (email: string) => {
  const result = await Order.find({ buyerEmail: email }).sort({
    updatedAt: -1,
  });
  return result;
};

const cancelOrder = async (id: string) => {
  const result = await Order.findOneAndUpdate(
    { _id: id }, // Use _id instead of id for MongoDB's unique identifier
    {
      deliveryStatus: 'cancel', // Assuming deliveryStatus is the field to be updated
    },
    { new: true },
  );

  return result;
};

export const orderServices = {
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  createOrderIntoDB,
  updateOrderIntoDB,
  getSingleOrderByOrderNumberFromDB,
  getSuccessfulDelivery,
  getMyOrders,
  cancelOrder,
};
