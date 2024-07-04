import express from 'express';
import { chartController } from './chart.controller';


const router = express.Router();

router.get('/inventory', chartController.getCategoryChartData);
router.get('/earning', chartController.getEarningsData);
router.get('/utils', chartController.utilsInfo);


export const chartRoutes = router;
