import mongoose from "mongoose";

const globalMongo = globalThis as typeof globalThis & { exnessCrmMongo?: Promise<typeof mongoose> };

export function hasValidMongoUri() {
  const uri = process.env.MONGO_URI?.trim();
  return Boolean(uri && (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://")));
}

export async function connectCrmMongo() {
  const uri = process.env.MONGO_URI?.trim();
  if (!uri || (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://"))) return null;
  if (!globalMongo.exnessCrmMongo) {
    globalMongo.exnessCrmMongo = mongoose.connect(uri);
  }
  return globalMongo.exnessCrmMongo;
}

const walletSchema = {
  main: { type: Number, default: 0 },
  trading: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  totalDeposit: { type: Number, default: 0 },
  totalWithdrawal: { type: Number, default: 0 },
  profitLoss: { type: Number, default: 0 },
  frozen: { type: Boolean, default: false }
};

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true, index: true },
    country: { type: String, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["client", "admin"], required: true, index: true },
    status: { type: String, index: true },
    balance: { type: Number, default: 0 },
    registeredAt: { type: String, index: true },
    dob: { type: String, default: "" },
    wallet: walletSchema,
    bankDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
    panDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
    kycStatus: { type: String, index: true },
    mt5Account: { type: mongoose.Schema.Types.Mixed, default: null },
    refreshTokenVersion: { type: Number, default: 0 },
    lastLoginAt: { type: String, default: "" }
  },
  { timestamps: true, collection: "crm_users" }
);
userSchema.index({ fullName: "text", email: "text", phone: "text", "panDetails.panNumber": "text", "mt5Account.loginId": "text" });

const depositSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    method: { type: String, index: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, index: true },
    screenshotUrl: String,
    proofName: String,
    proofDataUrl: String,
    proofPublicId: String,
    status: { type: String, index: true },
    createdAt: { type: String, index: true },
    adminComment: String,
    reviewedAt: String
  },
  { timestamps: true, collection: "crm_deposits" }
);
depositSchema.index({ userId: 1, status: 1, createdAt: -1 });

const withdrawalSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    amount: Number,
    payoutMethod: String,
    note: String,
    status: { type: String, index: true },
    createdAt: { type: String, index: true },
    adminComment: String,
    reviewedAt: String
  },
  { timestamps: true, collection: "crm_withdrawals" }
);
withdrawalSchema.index({ userId: 1, status: 1, createdAt: -1 });

const kycSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    panNumber: { type: String, index: true },
    nameOnPan: String,
    pdfName: String,
    pdfDataUrl: String,
    pdfPublicId: String,
    status: { type: String, index: true },
    createdAt: { type: String, index: true },
    adminComment: String,
    reviewedAt: String
  },
  { timestamps: true, collection: "crm_kyc" }
);
kycSchema.index({ userId: 1, status: 1, createdAt: -1 });

const transactionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    type: { type: String, index: true },
    amount: Number,
    note: String,
    status: { type: String, index: true },
    createdAt: { type: String, index: true }
  },
  { timestamps: true, collection: "crm_transactions" }
);
transactionSchema.index({ userId: 1, createdAt: -1 });

const paymentDetailsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { timestamps: true, collection: "crm_payment_details" }
);

const activityLogSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true },
    action: { type: String, required: true, index: true },
    ip: String,
    browser: String,
    device: String,
    meta: mongoose.Schema.Types.Mixed,
    createdAt: { type: String, index: true }
  },
  { timestamps: true, collection: "crm_activity_logs" }
);

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true },
    role: { type: String, index: true },
    title: String,
    message: String,
    read: { type: Boolean, default: false, index: true },
    createdAt: { type: String, index: true }
  },
  { timestamps: true, collection: "crm_notifications" }
);

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: mongoose.Schema.Types.Mixed
  },
  { timestamps: true, collection: "crm_settings" }
);

export const CrmModels = {
  User: mongoose.models.CrmUser || mongoose.model("CrmUser", userSchema),
  Deposit: mongoose.models.CrmDeposit || mongoose.model("CrmDeposit", depositSchema),
  Withdrawal: mongoose.models.CrmWithdrawal || mongoose.model("CrmWithdrawal", withdrawalSchema),
  Kyc: mongoose.models.CrmKyc || mongoose.model("CrmKyc", kycSchema),
  Transaction: mongoose.models.CrmTransaction || mongoose.model("CrmTransaction", transactionSchema),
  PaymentDetails: mongoose.models.CrmPaymentDetails || mongoose.model("CrmPaymentDetails", paymentDetailsSchema),
  ActivityLog: mongoose.models.CrmActivityLog || mongoose.model("CrmActivityLog", activityLogSchema),
  Notification: mongoose.models.CrmNotification || mongoose.model("CrmNotification", notificationSchema),
  Settings: mongoose.models.CrmSettings || mongoose.model("CrmSettings", settingsSchema)
};

export function cleanDoc<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}
