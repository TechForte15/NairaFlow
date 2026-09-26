import express from 'express';
import transactionsRoutes from './transactions.routes.js';

const router = express.Router();

router.use('/transactions', transactionsRoutes);

export default router;