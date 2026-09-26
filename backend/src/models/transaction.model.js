// Schema (agreed in the capstone doc):
//   id            string/int   primary key
//   reference     string       unique
//   senderId      string|null  FK -> Users (null for pure funding txns)
//   receiverId    string       FK -> Users
//   amount        number
//   type          enum         'FUNDING' | 'TRANSFER'
//   status        enum         'PENDING' | 'SUCCESS' | 'FAILED'
//   description   string|null
//   createdAt     datetime
//
// DB not chosen yet - using an in-memory array so routes are testable now.
// Once Postgres/MongoDB is picked, only this file needs to change.

const seedTransactions = [
    {
        id: '1',
        reference: 'TXN-0001',
        senderId: null,
        receiverId: 'user-1',
        amount: 20000,
        type: 'FUNDING',
        status: 'SUCCESS',
        description: 'Wallet funding',
        createdAt: new Date('2026-09-01T10:00:00Z'),
    },
    {
        id: '2',
        reference: 'TXN-0002',
        senderId: 'user-1',
        receiverId: 'user-2',
        amount: 5000,
        type: 'TRANSFER',
        status: 'SUCCESS',
        description: 'Dinner',
        createdAt: new Date('2026-09-05T14:30:00Z'),
    },
    {
        id: '3',
        reference: 'TXN-0003',
        senderId: 'user-2',
        receiverId: 'user-3',
        amount: 1000,
        type: 'TRANSFER',
        status: 'SUCCESS',
        description: 'Not related to user-1',
        createdAt: new Date('2026-09-06T09:00:00Z'),
    },
];

export async function findByUser(userId, { type } = {}) {
    return seedTransactions.filter((t) => {
        const belongsToUser = t.senderId === userId || t.receiverId === userId;
        const matchesType = type ? t.type === type : true;
        return belongsToUser && matchesType;
    });
}

export async function findById(id) {
    return seedTransactions.find((t) => t.id === id) || null;
}
