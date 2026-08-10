var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// backend/models/User.js
var require_User = __commonJS({
  "backend/models/User.js"(exports2, module2) {
    var mongoose2 = require("mongoose");
    var userSchema = new mongoose2.Schema({
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      }
    });
    module2.exports = mongoose2.model("User", userSchema);
  }
});

// backend/routes/authRoutes.js
var require_authRoutes = __commonJS({
  "backend/routes/authRoutes.js"(exports2, module2) {
    var express2 = require("express");
    var bcrypt = require("bcryptjs");
    var jwt = require("jsonwebtoken");
    var mongoose2 = require("mongoose");
    var User = require_User();
    var router = express2.Router();
    var inMemoryUsers = [];
    var JWT_SECRET = process.env.JWT_SECRET || "default-jwt-secret-key-12345";
    router.post("/register", async (req, res) => {
      const { name, email, password } = req.body;
      try {
        if (mongoose2.connection.readyState === 1) {
          const userExists = await User.findOne({ email });
          if (userExists) return res.status(400).json({ msg: "Email already exists" });
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await User.create({ name, email, password: hashedPassword });
          return res.status(201).json({ msg: "User registered successfully", user: { name: newUser.name, email: newUser.email } });
        } else {
          const userExists = inMemoryUsers.find((u) => u.email === email);
          if (userExists) return res.status(400).json({ msg: "Email already exists" });
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = { id: Date.now().toString(), name, email, password: hashedPassword };
          inMemoryUsers.push(newUser);
          return res.status(201).json({ msg: "User registered successfully", user: { name: newUser.name, email: newUser.email } });
        }
      } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ msg: "Server error" });
      }
    });
    router.post("/login", async (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ msg: "Please provide email and password" });
      }
      try {
        let user;
        if (mongoose2.connection.readyState === 1) {
          user = await User.findOne({ email });
        } else {
          user = inMemoryUsers.find((u) => u.email === email);
        }
        if (!user) return res.status(400).json({ msg: "Invalid email or password" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid email or password" });
        const userId = user._id ? user._id : user.id;
        const token = jwt.sign({ id: userId, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
        res.json({ token, user: { name: user.name, email: user.email } });
      } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ msg: "Server error" });
      }
    });
    router.get("/me", async (req, res) => {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "No token provided" });
      }
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.json({ user: { id: decoded.id, name: decoded.name, email: decoded.email } });
      } catch (err) {
        return res.status(401).json({ msg: "Invalid or expired token" });
      }
    });
    module2.exports = router;
  }
});

// backend/models/Appointment.js
var require_Appointment = __commonJS({
  "backend/models/Appointment.js"(exports2, module2) {
    var mongoose2 = require("mongoose");
    var appointmentSchema = new mongoose2.Schema({
      name: String,
      email: String,
      phone: String,
      date: String,
      time: String,
      notes: String,
      service: String,
      provider: String,
      price: String,
      status: String,
      paymentStatus: String,
      stripeSessionId: String,
      stripePaymentIntentId: String,
      amount: Number,
      currency: String
    }, { timestamps: true });
    module2.exports = mongoose2.model("Appointment", appointmentSchema);
  }
});

// backend/routes/appointments.js
var require_appointments = __commonJS({
  "backend/routes/appointments.js"(exports2, module2) {
    var express2 = require("express");
    var mongoose2 = require("mongoose");
    var router = express2.Router();
    var Appointment = require_Appointment();
    var inMemoryAppointments = [
      {
        _id: "1",
        service: "Haircut & Styling",
        provider: "Mr. Barber",
        date: "2025-07-05",
        time: "10:00 AM",
        status: "confirmed",
        name: "Anandkumar04",
        email: "anandkumar04@example.com",
        phone: "+91 9876543210"
      }
    ];
    router.get("/booked-slots", async (req, res) => {
      const { provider, date } = req.query;
      if (!provider || !date) {
        return res.status(400).json({ error: "provider and date query parameters are required" });
      }
      try {
        let slots = [];
        if (mongoose2.connection.readyState === 1) {
          const apps = await Appointment.find({ provider, date, status: { $ne: "cancelled" } });
          slots = apps.map((a) => a.time);
        } else {
          slots = inMemoryAppointments.filter((a) => a.provider === provider && a.date === date && a.status !== "cancelled").map((a) => a.time);
        }
        res.json({ provider, date, bookedSlots: slots });
      } catch (err) {
        console.error("Error fetching booked slots:", err);
        res.status(500).json({ error: "Server error" });
      }
    });
    router.post("/", async (req, res) => {
      const { name, email, phone, date, time, service, provider } = req.body;
      if (!name || !email || !phone || !date || !time || !service) {
        return res.status(400).json({ error: "Missing required appointment fields (name, email, phone, date, time, service)" });
      }
      try {
        if (mongoose2.connection.readyState === 1) {
          const conflict = await Appointment.findOne({
            provider,
            date,
            time,
            status: { $ne: "cancelled" }
          });
          if (conflict) {
            return res.status(409).json({ error: "This time slot is already booked for this provider. Please select another time." });
          }
          const newAppointment = new Appointment(req.body);
          const saved = await newAppointment.save();
          return res.status(201).json(saved);
        } else {
          const conflict = inMemoryAppointments.find(
            (a) => a.provider === provider && a.date === date && a.time === time && a.status !== "cancelled"
          );
          if (conflict) {
            return res.status(409).json({ error: "This time slot is already booked for this provider. Please select another time." });
          }
          const newApp = {
            _id: Date.now().toString(),
            ...req.body,
            status: req.body.status || "confirmed",
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          inMemoryAppointments.push(newApp);
          return res.status(201).json(newApp);
        }
      } catch (err) {
        console.error("Error saving appointment:", err);
        res.status(500).json({ error: "Server error" });
      }
    });
    router.patch("/:id/status", async (req, res) => {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      try {
        if (mongoose2.connection.readyState === 1) {
          const updated = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
          );
          if (!updated) return res.status(404).json({ error: "Appointment not found" });
          return res.json(updated);
        } else {
          const app = inMemoryAppointments.find((a) => a._id === req.params.id);
          if (!app) return res.status(404).json({ error: "Appointment not found" });
          app.status = status;
          return res.json(app);
        }
      } catch (err) {
        console.error("Error updating status:", err);
        res.status(500).json({ error: "Server error" });
      }
    });
    router.get("/", async (req, res) => {
      try {
        if (mongoose2.connection.readyState === 1) {
          const all = await Appointment.find();
          return res.json(all);
        } else {
          return res.json(inMemoryAppointments);
        }
      } catch (err) {
        console.error("Error getting appointments:", err);
        res.json(inMemoryAppointments);
      }
    });
    router.delete("/:id", async (req, res) => {
      try {
        if (mongoose2.connection.readyState === 1) {
          await Appointment.findByIdAndDelete(req.params.id);
        } else {
          const index = inMemoryAppointments.findIndex((a) => a._id === req.params.id);
          if (index !== -1) {
            inMemoryAppointments.splice(index, 1);
          }
        }
        res.json({ success: true });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete appointment" });
      }
    });
    module2.exports = router;
  }
});

// backend/routes/payments.js
var require_payments = __commonJS({
  "backend/routes/payments.js"(exports2, module2) {
    var express2 = require("express");
    var mongoose2 = require("mongoose");
    var Appointment = require_Appointment();
    var router = express2.Router();
    var stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    var parseAmountInPaise = (price) => {
      const numericPrice = Number(String(price || "").replace(/[^0-9.]/g, ""));
      if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
        return null;
      }
      return Math.round(numericPrice * 100);
    };
    var buildFrontendBaseUrl = (req) => {
      const origin = req.get("origin") || req.headers.origin || process.env.FRONTEND_URL;
      if (origin) {
        return origin.replace(/\/$/, "");
      }
      return `${req.protocol}://${req.get("host")}`;
    };
    var buildAppointmentData = (metadata = {}) => ({
      name: metadata.name || "",
      email: metadata.email || "",
      phone: metadata.phone || "",
      date: metadata.date || "",
      time: metadata.time || "",
      notes: metadata.notes || "",
      service: metadata.service || "",
      provider: metadata.provider || "",
      price: metadata.price || "",
      status: "confirmed",
      paymentStatus: "paid",
      stripeSessionId: metadata.stripeSessionId || "",
      stripePaymentIntentId: metadata.stripePaymentIntentId || "",
      amount: metadata.amount ? Number(metadata.amount) : void 0,
      currency: metadata.currency || "inr"
    });
    var callStripeApi = async (endpoint, body) => {
      if (!stripeSecretKey) {
        throw new Error("Stripe is not configured on the server");
      }
      const response = await fetch(`https://api.stripe.com/v1/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(body)
      });
      const data = await response.json();
      if (!response.ok) {
        const message = data?.error?.message || "Stripe request failed";
        throw new Error(message);
      }
      return data;
    };
    var retrieveStripeCheckoutSession = async (sessionId) => {
      if (!stripeSecretKey) {
        throw new Error("Stripe is not configured on the server");
      }
      const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        const message = data?.error?.message || "Stripe request failed";
        throw new Error(message);
      }
      return data;
    };
    router.post("/create-checkout-session", async (req, res) => {
      if (!stripeSecretKey) {
        return res.status(503).json({ error: "Stripe is not configured on the server" });
      }
      const { name, email, phone, date, time, service, provider, price, notes } = req.body;
      if (!name || !email || !phone || !date || !time || !service || !provider || !price) {
        return res.status(400).json({ error: "Missing required booking fields for payment" });
      }
      const amount = parseAmountInPaise(price);
      if (!amount) {
        return res.status(400).json({ error: "Invalid price value" });
      }
      try {
        const frontendBaseUrl = buildFrontendBaseUrl(req);
        const session = await callStripeApi("checkout/sessions", {
          mode: "payment",
          customer_email: email,
          success_url: `${frontendBaseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${frontendBaseUrl}/payment/cancel`,
          "line_items[0][price_data][currency]": "inr",
          "line_items[0][price_data][product_data][name]": `${service} - ${provider}`,
          "line_items[0][price_data][product_data][description]": `${date} at ${time}`,
          "line_items[0][price_data][unit_amount]": String(amount),
          "line_items[0][quantity]": "1",
          "metadata[name]": name,
          "metadata[email]": email,
          "metadata[phone]": phone,
          "metadata[date]": date,
          "metadata[time]": time,
          "metadata[service]": service,
          "metadata[provider]": provider,
          "metadata[price]": price,
          "metadata[notes]": notes || "",
          "metadata[amount]": String(amount),
          "metadata[currency]": "inr"
        });
        return res.status(200).json({
          id: session.id,
          url: session.url
        });
      } catch (error) {
        console.error("Error creating Stripe checkout session:", error);
        return res.status(500).json({ error: "Unable to create payment session" });
      }
    });
    router.post("/confirm-checkout-session", async (req, res) => {
      if (!stripeSecretKey) {
        return res.status(503).json({ error: "Stripe is not configured on the server" });
      }
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ error: "sessionId is required" });
      }
      try {
        const session = await retrieveStripeCheckoutSession(sessionId);
        if (session.payment_status !== "paid") {
          return res.status(400).json({ error: "Payment has not been completed yet" });
        }
        if (mongoose2.connection.readyState !== 1) {
          return res.status(503).json({ error: "Database is not connected" });
        }
        const existingAppointment = await Appointment.findOne({ stripeSessionId: session.id });
        if (existingAppointment) {
          return res.json(existingAppointment);
        }
        const appointmentData = buildAppointmentData({
          ...session.metadata,
          stripeSessionId: session.id,
          stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : "",
          amount: session.amount_total ? String(session.amount_total) : session.metadata?.amount,
          currency: session.currency || "inr"
        });
        const createdAppointment = await Appointment.create(appointmentData);
        return res.status(201).json(createdAppointment);
      } catch (error) {
        console.error("Error confirming Stripe checkout session:", error);
        return res.status(500).json({ error: "Unable to confirm payment session" });
      }
    });
    module2.exports = router;
  }
});

// server.js
var express = require("express");
var path = require("path");
var cors = require("cors");
var dotenv = require("dotenv");
var mongoose = require("mongoose");
dotenv.config();
var authRoutes = require_authRoutes();
var appointmentRoutes = require_appointments();
var paymentRoutes = require_payments();
async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3e3;
  app.use(express.json());
  app.use(cors());
  mongoose.set("bufferCommands", false);
  if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected successfully")).catch((err) => console.warn("MongoDB connection error:", err.message));
  } else {
    console.warn("MONGO_URI not set \u2014 database features will operate in in-memory fallback mode");
  }
  app.get("/api/health", (req, res) => {
    res.json({ status: "connected", dbState: mongoose.connection.readyState });
  });
  app.use("/api/auth", authRoutes);
  app.use("/api/appointments", appointmentRoutes);
  app.use("/api/payments", paymentRoutes);
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = require("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: path.join(__dirname, "frontend")
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "frontend", "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
