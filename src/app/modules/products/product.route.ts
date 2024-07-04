import express from 'express';

import validateRequest from '../../middlewares/validateRequest';

import { ProductValidations } from './product.validation';
import { ProductControllers } from './product.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-product',
  auth(USER_ROLE.superAdmin),
  validateRequest(ProductValidations.CreateProductValidationSchema),
  ProductControllers.createProduct,
);

router.patch(
  '/delete-product/:id',
  auth(USER_ROLE.superAdmin),
  
  ProductControllers.deleteProduct,
);
router.patch(
  '/update-product/:id',
  auth(USER_ROLE.superAdmin),
  
  ProductControllers.updateProduct,
);

router.get(
  '/get-single-product/:id',

  ProductControllers.getSingleProduct,
);

router.get(
  '/',

  ProductControllers.getAllProdycts,
);

router.get(
  '/category/:category',

  ProductControllers.getAllProductsByCategory,
);

export const ProductsRoutes = router;
