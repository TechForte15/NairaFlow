import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { list, getById } from '../controllers/transactions.controller.js';
import { validateListQuery, validateIdParam } from '../validations/transactions.validation.js';

const router = express.Router();

router.get('/', requireAuth, validateListQuery, list);
router.get('/:id', requireAuth, validateIdParam, getById);

export default router;