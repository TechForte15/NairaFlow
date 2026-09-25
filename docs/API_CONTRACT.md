# NairaFlow Planned API Contract

> **PLANNED API CONTRACT:** This is a simple starting list only. The team will agree on the exact request and response details while building each feature. Nothing in this document has been implemented yet.

## Auth

| Endpoint | What it is supposed to do | What the frontend will send | What the backend will return |
| --- | --- | --- | --- |
| `POST /api/auth/register` | Create a new user account. | Planned registration details. | Planned new-user and account result. |
| `POST /api/auth/login` | Sign an existing user in. | Planned login details. | Planned sign-in result. |

## User

| Endpoint | What it is supposed to do | What the frontend will send | What the backend will return |
| --- | --- | --- | --- |
| `GET /api/users/me` | Get the current user's details. | Planned identification details. | Planned current-user information. |

## Wallet

| Endpoint | What it is supposed to do | What the frontend will send | What the backend will return |
| --- | --- | --- | --- |
| `GET /api/wallet` | Get the current user's wallet information. | Planned identification details. | Planned wallet information. |
| `POST /api/wallet/fund` | Add money to a wallet. | Planned funding details. | Planned funding result and wallet information. |

## Transfers

| Endpoint | What it is supposed to do | What the frontend will send | What the backend will return |
| --- | --- | --- | --- |
| `POST /api/transfers` | Send money from one wallet to another. | Planned recipient and transfer details. | Planned transfer result. |

## Transactions

| Endpoint | What it is supposed to do | What the frontend will send | What the backend will return |
| --- | --- | --- | --- |
| `GET /api/transactions` | Get a user's transactions. | Planned identification or filter details. | Planned list of transactions. |
| `GET /api/transactions/:id` | Get one transaction by its ID. | The transaction ID in the URL. | Planned transaction details. |
