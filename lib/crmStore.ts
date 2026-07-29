import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { cleanDoc, connectCrmMongo, CrmModels } from "@/lib/crmModels";

export type CrmRole = "client" | "admin";
export type AccountStatus = "Pending Approval" | "Approved" | "Rejected" | "Suspended";
export type RequestStatus = "Pending" | "Approved" | "Rejected" | "Paid";
export type KycStatus = "Pending" | "Approved" | "Rejected" | "Reupload Requested";

export type Wallet = {
  main: number;
  trading: number;
  bonus: number;
  totalDeposit: number;
  totalWithdrawal: number;
  profitLoss: number;
  frozen: boolean;
};

export type BankDetails = {
  bankName: string;
  accountNumber: string;
  ifsc: string;
  accountHolder: string;
  upi: string;
};

export type PanDetails = {
  panNumber: string;
  nameOnPan: string;
  pdfName: string;
  pdfDataUrl: string;
  pdfPublicId?: string;
};

export type Mt5Account = {
  loginId: string;
  password: string;
  server: string;
  leverage: string;
  accountType: string;
  balance: number;
};

export type CrmUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  password: string;
  role: CrmRole;
  status: AccountStatus;
  balance: number;
  registeredAt: string;
  dob: string;
  wallet: Wallet;
  bankDetails: BankDetails;
  panDetails: PanDetails;
  kycStatus: KycStatus;
  mt5Account: Mt5Account | null;
};

export type DepositRequest = {
  id: string;
  userId: string;
  method: "UPI" | "Bank Transfer" | "USDT";
  amount: number;
  transactionId: string;
  screenshotUrl: string;
  proofName: string;
  proofDataUrl: string;
  proofPublicId?: string;
  status: RequestStatus;
  createdAt: string;
  adminComment?: string;
  reviewedAt?: string;
};

export type WithdrawalRequest = {
  id: string;
  userId: string;
  amount: number;
  payoutMethod: string;
  note: string;
  status: RequestStatus;
  createdAt: string;
};

export type KycDocument = {
  id: string;
  userId: string;
  panNumber: string;
  nameOnPan: string;
  pdfName: string;
  pdfDataUrl: string;
  pdfPublicId?: string;
  status: KycStatus;
  createdAt: string;
  adminComment?: string;
  reviewedAt?: string;
};

export type Transaction = {
  id: string;
  userId: string;
  type: "Deposit" | "Withdrawal" | "Credit" | "Debit" | "Bonus";
  amount: number;
  note: string;
  status: RequestStatus;
  createdAt: string;
};

export type PaymentDetails = {
  UPI: { value: string; note: string };
  "Bank Transfer": { value: string; note: string };
  USDT: { value: string; note: string };
};

type Store = {
  users: CrmUser[];
  deposits: DepositRequest[];
  withdrawals: WithdrawalRequest[];
  kycDocuments: KycDocument[];
  transactions: Transaction[];
  paymentDetails: PaymentDetails;
};

const globalStore = globalThis as typeof globalThis & { exnessCrmStore?: Store };

const emptyWallet: Wallet = {
  main: 0,
  trading: 0,
  bonus: 0,
  totalDeposit: 0,
  totalWithdrawal: 0,
  profitLoss: 0,
  frozen: false
};

function now() {
  return new Date().toISOString();
}

function storeFilePath() {
  return path.join(process.cwd(), "data", "crm-store.json");
}

function defaultStore(): Store {
  return {
      users: [
        {
          id: "admin-1",
          fullName: "Super Admin",
          email: "admin@exnessglobal.com",
          phone: "+91 00000 00000",
          country: "India",
          password: "admin123",
          role: "admin",
          status: "Approved",
          balance: 0,
          registeredAt: now(),
          dob: "",
          wallet: { ...emptyWallet },
          bankDetails: { bankName: "", accountNumber: "", ifsc: "", accountHolder: "", upi: "" },
          panDetails: { panNumber: "", nameOnPan: "", pdfName: "", pdfDataUrl: "" },
          kycStatus: "Approved",
          mt5Account: null
        },
        {
          id: "client-1",
          fullName: "Demo Client",
          email: "client@exnessglobal.com",
          phone: "+91 98765 43210",
          country: "India",
          password: "client123",
          role: "client",
          status: "Approved",
          balance: 0,
          registeredAt: now(),
          dob: "1995-01-01",
          wallet: { ...emptyWallet },
          bankDetails: {
            bankName: "HDFC Bank",
            accountNumber: "XXXX-2241",
            ifsc: "HDFC0001234",
            accountHolder: "Demo Client",
            upi: "demo@upi"
          },
          panDetails: { panNumber: "", nameOnPan: "", pdfName: "", pdfDataUrl: "" },
          kycStatus: "Pending",
          mt5Account: null
        }
      ],
      deposits: [],
      withdrawals: [],
      kycDocuments: [],
      transactions: [],
      paymentDetails: {
        UPI: { value: "exnessglobal@upi", note: "Pay using any UPI app and upload UTR/screenshot." },
        "Bank Transfer": { value: "Exness Global Client Funding - A/C 44551000", note: "IFSC: EXNS0001234, Branch: Mumbai, Account Type: Current" },
        USDT: { value: "TExness93DemoWalletTRC20Address", note: "Send only USDT TRC20 and upload transaction hash." }
      }
    };
}

function normalizeStore(store: Store): Store {
  const fallback = defaultStore();
  return {
    ...fallback,
    ...store,
    users: Array.isArray(store.users) ? store.users : fallback.users,
    deposits: Array.isArray(store.deposits) ? store.deposits : [],
    withdrawals: Array.isArray(store.withdrawals) ? store.withdrawals : [],
    kycDocuments: Array.isArray(store.kycDocuments) ? store.kycDocuments : [],
    transactions: Array.isArray(store.transactions) ? store.transactions : [],
    paymentDetails: store.paymentDetails || fallback.paymentDetails
  };
}

function loadCrmStoreFromDisk() {
  const file = storeFilePath();
  if (!existsSync(file)) return defaultStore();
  try {
    return normalizeStore(JSON.parse(readFileSync(file, "utf8")) as Store);
  } catch {
    return defaultStore();
  }
}

async function loadCrmStoreFromMongo() {
  try {
    const connection = await connectCrmMongo();
    if (!connection) return null;

    const userCount = await CrmModels.User.countDocuments();
    if (userCount === 0) {
      const fresh = defaultStore();
      const seededUsers = await Promise.all(fresh.users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      })));
      await CrmModels.User.insertMany(seededUsers);
      await CrmModels.PaymentDetails.updateOne({ key: "main" }, { $set: { data: fresh.paymentDetails } }, { upsert: true });
    }

    const [users, deposits, withdrawals, kycDocuments, transactions, paymentDetails] = await Promise.all([
      CrmModels.User.find({}).sort({ createdAt: -1 }).lean(),
      CrmModels.Deposit.find({}).sort({ createdAt: -1 }).lean(),
      CrmModels.Withdrawal.find({}).sort({ createdAt: -1 }).lean(),
      CrmModels.Kyc.find({}).sort({ createdAt: -1 }).lean(),
      CrmModels.Transaction.find({}).sort({ createdAt: -1 }).lean(),
      CrmModels.PaymentDetails.findOne({ key: "main" }).lean()
    ]);

    return normalizeStore({
      users: cleanDoc(users) as unknown as CrmUser[],
      deposits: cleanDoc(deposits) as unknown as DepositRequest[],
      withdrawals: cleanDoc(withdrawals) as unknown as WithdrawalRequest[],
      kycDocuments: cleanDoc(kycDocuments) as unknown as KycDocument[],
      transactions: cleanDoc(transactions) as unknown as Transaction[],
      paymentDetails: (cleanDoc(paymentDetails || {}) as { data?: PaymentDetails }).data || defaultStore().paymentDetails
    });
  } catch {
    return null;
  }
}

export function getCrmStore() {
  if (!globalStore.exnessCrmStore) {
    globalStore.exnessCrmStore = loadCrmStoreFromDisk();
  }
  return globalStore.exnessCrmStore;
}

export function saveCrmStore(store = getCrmStore()) {
  const file = storeFilePath();
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(store, null, 2), "utf8");
}

export async function getCrmStoreAsync() {
  const mongoStore = await loadCrmStoreFromMongo();
  if (mongoStore) {
    globalStore.exnessCrmStore = mongoStore;
    return mongoStore;
  }
  return getCrmStore();
}

export async function saveCrmStoreAsync(store = getCrmStore()) {
  try {
    const connection = await connectCrmMongo();
    if (connection) {
      await syncCollection(CrmModels.User, store.users);
      await syncCollection(CrmModels.Deposit, store.deposits);
      await syncCollection(CrmModels.Withdrawal, store.withdrawals);
      await syncCollection(CrmModels.Kyc, store.kycDocuments);
      await syncCollection(CrmModels.Transaction, store.transactions);
      await CrmModels.PaymentDetails.updateOne({ key: "main" }, { $set: { data: store.paymentDetails } }, { upsert: true });
      globalStore.exnessCrmStore = store;
      return;
    }
} catch (err) {
  console.error("Mongo Save Error:");
  console.error(err);
}
  try {
    saveCrmStore(store);
  } catch {
    globalStore.exnessCrmStore = store;
  }
}

async function syncCollection(
  model: { deleteMany: Function; bulkWrite: Function },
  items: { id: string }[]
) {
  const ids = items.map((item) => item.id);

  await model.deleteMany({ id: { $nin: ids } });

  if (items.length === 0) return;

  try {
    const result = await model.bulkWrite(
      items.map((item) => ({
        updateOne: {
          filter: { id: item.id },
          update: { $set: item },
          upsert: true
        }
      })),
      { ordered: false }
    );

    console.log("BulkWrite Success:", result);
  } catch (err) {
    console.error("BulkWrite Error:");
    console.error(err);
  }
}

export function publicUser(user: CrmUser) {
  const { password, ...safeUser } = user;
  return safeUser;
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}
