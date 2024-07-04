// import axios, { AxiosError } from 'axios'; // Import AxiosError
// import { NextFunction, Request, Response } from 'express';
// import globals from 'node-global-storage';
// import config from '../../config';

// class middleware {
//     bkash_auth = async (req: Request, res: Response, next: NextFunction) => {
//         globals.unset('id_token');

//         try {
//             const { data } = await axios.post(config.bkash_create_payment_url : st, {
//                 app_key: config.bkash_api_key,
//                 app_secret: config.bkash_secret_key,
//             }, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Accept": "application/json",
//                     username: process.env.bkash_username,
//                     password: process.env.bkash_password,
//                 }
//             });

//             globals.set('id_token', data.id_token, { protected: true });

//             next();
//         } catch (error) {
//             const axiosError = error as AxiosError; // Cast error to AxiosError
//             return res.status(401).json({ error: axiosError.message }); // Use axiosError.message
//         }
//     }
// }

// module.exports = new middleware();
