import { asyncHandler } from '../utils/asyncHandler.js';
import { success } from '../utils/apiResponse.js';
import * as transactionsService from '../services/transactions.service.js';

export const list = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { page, limit, type } = req.query;

    const result = await transactionsService.listForUser(userId, { page, limit, type });
    return success(res, 'Transactions retrieved successfully', result);
});


export const getById = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    const transaction = await transactionsService.getByIdForUser(id, userId);

    return success(res, 'Transaction retrieved successfully', transaction);
});

