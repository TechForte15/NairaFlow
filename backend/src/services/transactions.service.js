import * as transactionModel from '../models/transaction.model.js';

export async function listForUser(userId, { page, limit, type }) {
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);

    const all = await transactionModel.findByUser(userId, { type });
    const total = all.length;
    const start = (pageNum - 1) * limitNum;

    const items = all
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(start, start + limitNum);

    return {
        items,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum) || 1,
        },
    };
}


export async function getByIdForUser(id, userId) {
    const transaction = await transactionModel.findById(id);

    if (!transaction) {
        const err = new Error('Transaction not found');
        err.statusCode = 404;
        throw err;
    }

    const belongsToUser = transaction.senderId === userId || transaction.receiverId === userId;

    if(!belongsToUser) {
        const err = new Error('Transaction not found'); // same message on purpose — so hackers do not get hints on what to attack.
        err.statusCode = 404;
        throw err
    }

    return transaction;
}
