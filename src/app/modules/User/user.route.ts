/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';

import { UserControllers } from './user.controller';
import { USER_ROLE } from './user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-user',

  // validateRequest(UserValidation.createUserValidationSchema),

  UserControllers.createUser,
);

router.get('/', auth(USER_ROLE.superAdmin), UserControllers.getAllUser);

router.get(
  '/me',
  auth(USER_ROLE.superAdmin, USER_ROLE.user),
  UserControllers.getMe,
);
router.get(
  '/user-dashboard-data/:email',
  // auth(USER_ROLE.user),
  UserControllers.getUserDashboardData,
);



export const UserRoutes = router;
