import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string,subject:string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === ' production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'farhan.adnan1952@gmail.com',
      pass: 'odogzppnxqlrgqjr ',
    },
  });

  await transporter.sendMail({
    from: 'farhan.adnan1952@gmail.com',
    to,
    // to: "sobujapm87@gmail.com",
    subject,
    text: 'Enjoy your shopping!!',
    html,
  });
};

// `

//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Invoice</title>
//     </head>
//     <body style="background-color: #f3f4f6; padding: 20px; font-family: Arial, sans-serif;">
//     <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
//         <div style="background-color: #a1a1a136;padding-left: 20px;  padding-right: 20px; padding-top: 30px; border-radius: 15px;">
//             <div style="text-align: center; margin-bottom: 20px;">
//                 <div style="background-color: #f3f4f6; padding: 20px; margin-bottom: 10px;">
//                   <img src="https://i.ibb.co/HqRBG9S/PNG-Richkid-Logo.png" alt="logo">
//                 </div>
//                   <h2 style="font-size: 24px; font-weight: bold; margin: 0;">Invoice</h2>
//                   <p style="font-size: 14px; color: #7a7a7a; margin-top: 5px;">Order ID# 438904</p>
//               </div>

//               <div style="margin-bottom: 20px;">
//                   <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Shipping Address</h3>
//                   <p style="font-size: 14px; color: #333333; margin: 0;">Farhan Adnan</p>
//                   <p style="font-size: 14px; color: #333333; margin: 0;">Konabari, College Gate, Konabari, Gazipur</p>
//                   <p style="font-size: 14px; color: #333333; margin: 0;">Gazipur City, Bangladesh</p>
//                   <p style="font-size: 14px; color: #333333; margin: 0;">Phone: 01704987382</p>
//                   <p style="font-size: 14px; color: #333333; margin: 0;">Email: md.masum0058@gmail.com</p>
//               </div>

//               <div style="margin-bottom: 20px;">
//                   <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Order Summary</h3>
//                   <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
//                       <tbody>
//                           <tr>
//                               <td style="padding: 8px 0;">Payment Method:</td>
//                               <td style="padding: 8px 0;">Cash on Delivery</td>
//                           </tr>
//                           <tr>
//                               <td style="padding: 8px 0;">Shipping Method:</td>
//                               <td style="padding: 8px 0;">Home Delivery</td>
//                           </tr>
//                           <tr>
//                               <td style="padding: 8px 0;">Sub-Total:</td>
//                               <td style="padding: 8px 0;">350৳</td>
//                           </tr>
//                           <tr>
//                               <td style="padding: 8px 0;">Home Delivery:</td>
//                               <td style="padding: 8px 0;">60৳</td>
//                           </tr>
//                           <tr>
//                               <td style="padding: 8px 0; border-top: 1px solid #e0e0e0; font-weight: bold;">Total:</td>
//                               <td style="padding: 8px 0; border-top: 1px solid #e0e0e0; font-weight: bold;">410৳</td>
//                           </tr>
//                       </tbody>
//                   </table>
//               </div>

//         </div>
//             <div>
//                 <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Products</h3>
//                 <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
//                     <thead>
//                         <tr>
//                             <th style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">Product</th>
//                             <th style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">Quantity</th>
//                             <th style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">Total</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         ${payload.orderProduct
//                           .map(
//                             (product) => `
//                             <tr>
//                                 <td style="padding: 8px 0;">${product.name}</td>
//                                 <td style="padding: 8px 0;">${product.selectedQuantity}</td>
//                                 <td style="padding: 8px 0;">${product.price}</td>
//                             </tr>
//                         `,
//                           )
//                           .join('')}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     </body>
//     </html>
//     `,
