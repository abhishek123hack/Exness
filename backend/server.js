require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || "http://localhost:3000" } });

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "Exness Global CRM API", realtime: "socket.io", database: "mongodb" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    console.log("Database:", mongoose.connection.name);
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error");
    console.error("Name:", err.name);
    console.error("Message:", err.message);

    if (err.reason) {
      console.error("Reason:", err.reason);
    }
  });
const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: { type: String, unique: true },
    phone: String,
    country: String,
    passwordHash: String,
    role: { type: String, enum: ["client", "admin"], default: "client" },
    verificationStatus: { type: String, enum: ["Pending", "Verified", "Rejected"], default: "Pending" },
    twoFactorEnabled: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const walletSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    mainWallet: { type: Number, default: 0 },
    bonusWallet: { type: Number, default: 0 },
    tradingWallet: { type: Number, default: 0 },
    frozen: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const transactionSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    type: String,
    amount: Number,
    wallet: String,
    status: { type: String, default: "Pending" },
    note: String
  },
  { timestamps: true }
);

const depositSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    method: String,
    amount: Number,
    transactionId: String,
    screenshotUrl: String,
    status: { type: String, default: "Pending" }
  },
  { timestamps: true }
);

const withdrawalSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    method: String,
    amount: Number,
    payoutDetails: String,
    status: { type: String, default: "Pending" }
  },
  { timestamps: true }
);

const kycSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    idProofUrl: String,
    addressProofUrl: String,
    selfieUrl: String,
    status: { type: String, default: "Pending" },
    adminNote: String
  },
  { timestamps: true }
);

const mt5Schema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    mt5Id: String,
    password: String,
    server: String,
    leverage: String,
    accountType: String,
    balance: { type: Number, default: 0 },
    status: { type: String, default: "Active" }
  },
  { timestamps: true }
);

const notificationSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    title: String,
    body: String,
    channel: String,
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const ticketSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    subject: String,
    priority: { type: String, default: "Medium" },
    status: { type: String, default: "Open" },
    messages: [{ sender: String, body: String, at: Date }]
  },
  { timestamps: true }
);

const activityLogSchema = new mongoose.Schema(
  {
    adminId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    action: String,
    ip: String,
    device: String,
    note: String
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", walletSchema);
const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
const Deposit = mongoose.models.Deposit || mongoose.model("Deposit", depositSchema);
const Withdrawal = mongoose.models.Withdrawal || mongoose.model("Withdrawal", withdrawalSchema);
const KycDocument = mongoose.models.KycDocument || mongoose.model("KycDocument", kycSchema);
const Mt5Account = mongoose.models.Mt5Account || mongoose.model("Mt5Account", mt5Schema);
const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
const SupportTicket = mongoose.models.SupportTicket || mongoose.model("SupportTicket", ticketSchema);
const ActivityLog = mongoose.models.ActivityLog || mongoose.model("ActivityLog", activityLogSchema);

function sign(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
}

function auth(requiredRole) {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
      req.user = payload;
      if (requiredRole && payload.role !== requiredRole) return res.status(403).json({ message: "Forbidden" });
      next();
    } catch {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
}

app.post("/api/auth/signup", async (req, res) => {
  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const user = await User.create({ ...req.body, passwordHash, password: undefined });
  await Wallet.create({ userId: user._id });
  res.json({ token: sign(user), user: { id: user._id, role: user.role, status: user.verificationStatus } });
});

app.post("/api/auth/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) return res.status(401).json({ message: "Invalid credentials" });
  if (user.blocked) return res.status(403).json({ message: "Account blocked" });
  res.json({ token: sign(user), user: { id: user._id, role: user.role, status: user.verificationStatus } });
});

app.get("/api/client/me", auth(), async (req, res) => {
  const [user, wallet, mt5, notifications] = await Promise.all([
    User.findById(req.user.id).select("-passwordHash"),
    Wallet.findOne({ userId: req.user.id }),
    Mt5Account.find({ userId: req.user.id }),
    Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(20)
  ]);
  res.json({ user, wallet, mt5, notifications });
});

app.post("/api/client/deposits", auth("client"), async (req, res) => res.json(await Deposit.create({ ...req.body, userId: req.user.id })));
app.post("/api/client/withdrawals", auth("client"), async (req, res) => res.json(await Withdrawal.create({ ...req.body, userId: req.user.id })));
app.post("/api/client/kyc", auth("client"), async (req, res) => res.json(await KycDocument.create({ ...req.body, userId: req.user.id })));
app.post("/api/client/tickets", auth("client"), async (req, res) => res.json(await SupportTicket.create({ ...req.body, userId: req.user.id })));

app.get("/api/admin/clients", auth("admin"), async (_req, res) => res.json(await User.find().select("-passwordHash").sort({ createdAt: -1 })));
app.patch("/api/admin/users/:id/status", auth("admin"), async (req, res) => res.json(await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-passwordHash")));

app.patch("/api/admin/deposits/:id/approve", auth("admin"), async (req, res) => {
  const deposit = await Deposit.findByIdAndUpdate(req.params.id, { status: "Approved" }, { new: true });
  await Wallet.findOneAndUpdate({ userId: deposit.userId }, { $inc: { mainWallet: deposit.amount } }, { upsert: true });
  await Transaction.create({ userId: deposit.userId, type: "Deposit", wallet: "Main Wallet", amount: deposit.amount, status: "Approved" });
  io.to(String(deposit.userId)).emit("notification", { title: "Deposit approved", amount: deposit.amount });
  res.json(deposit);
});

app.patch("/api/admin/withdrawals/:id/approve", auth("admin"), async (req, res) => {
  const withdrawal = await Withdrawal.findByIdAndUpdate(req.params.id, { status: "Processed" }, { new: true });
  await Wallet.findOneAndUpdate({ userId: withdrawal.userId }, { $inc: { mainWallet: -withdrawal.amount } });
  await Transaction.create({ userId: withdrawal.userId, type: "Withdrawal", wallet: "Main Wallet", amount: withdrawal.amount, status: "Processed" });
  res.json(withdrawal);
});

app.post("/api/admin/mt5", auth("admin"), async (req, res) => res.json(await Mt5Account.create(req.body)));
app.post("/api/admin/wallets/adjust", auth("admin"), async (req, res) => {
  const { userId, wallet = "mainWallet", amount, note } = req.body;
  const walletDoc = await Wallet.findOneAndUpdate({ userId }, { $inc: { [wallet]: amount } }, { new: true, upsert: true });
  await Transaction.create({ userId, type: "Manual Adjustment", wallet, amount, note, status: "Approved" });
  res.json(walletDoc);
});

app.post("/api/admin/notifications/broadcast", auth("admin"), async (req, res) => {
  io.emit("notification", req.body);
  res.json({ sent: true });
});

app.post("/api/admin/logs", auth("admin"), async (req, res) => res.json(await ActivityLog.create({ ...req.body, adminId: req.user.id })));

io.on("connection", (socket) => {
  socket.on("join", (userId) => socket.join(String(userId)));
  socket.emit("market:update", { symbol: "EUR/USD", bid: 1.08742, ask: 1.08755 });
});

server.listen(process.env.API_PORT || 4000, () => {
  console.log(`CRM API running on port ${process.env.API_PORT || 4000}`);
});
