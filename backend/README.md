# Exness Global CRM Backend

Express/Mongo/JWT/Socket.io API scaffold for the forex broker CRM.

Collections covered:
- Users
- Wallets
- Transactions
- Deposits
- Withdrawals
- KYC Documents
- MT5 Accounts
- Notifications
- Support Tickets
- Activity Logs

Run after installing dependencies:

```bash
npm run api
```

Environment variables:

```bash
MONGO_URI=mongodb://127.0.0.1:27017/exnessglobal_crm
JWT_SECRET=replace-with-secure-secret
CLIENT_URL=http://localhost:3000
API_PORT=4000
```
