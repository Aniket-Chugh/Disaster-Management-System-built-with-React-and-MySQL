require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const twilio = require("twilio");
const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

  // ✅ Allow Preflight (OPTIONS) requests
  app.options("*", cors());

  app.use(express.json());


// ✅ Twilio Config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;
const client = twilio(accountSid, authToken);

const otpStore = new Map();


// ✅ MySQL DB Connection
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
conn.connect((err) => {
  if (err) {
    console.error("❌ DB connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL DB");
  }
});

// ✅ Utility
const normalizePhone = (phone) => {
  if (/^\d{10}$/.test(phone)) return "+91" + phone;
  if (/^\+91\d{10}$/.test(phone)) return phone;
  return null;
};


// ✅ Routes
app.get("/", (req, res) => {
  res.send("🌍 Backend is up!");
});

app.get("/users", (req, res) => {
  conn.query("SELECT * FROM users", (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json(result);
  });
});

app.post("/support-data", (req, res) => {
  const { name, phone_num, message } = req.body;
  const query = "INSERT INTO supports(username, phonenumber, message) VALUES (?, ?, ?)";

  conn.query(query, [name, phone_num, message], (err, result) => {
    if (err) {
      console.error("Error inserting report:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json(result.insertId);
  });
});

app.get("/support-data", (req, res) => {
  const query = "SELECT * FROM supports";
  conn.query(query, (err, result) => {
    if (err) {
      console.error("Error retrieving reports:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json(result);
  });
});

app.post("/current-user", (req, res) => {
  const { id } = req.body;
  const query = "SELECT * FROM supports WHERE id = ?";

  conn.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching report:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json(result);
  });
});

app.post("/users", (req, res) => {
  const { phone, name, email, password } = req.body;

  if (!phone || !name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const normPhone = normalizePhone(phone);
  if (!normPhone) {
    return res.status(400).json({ success: false, message: "Invalid phone format" });
  }

  const checkQuery = "SELECT * FROM users WHERE phone = ? OR email = ?";
  conn.query(checkQuery, [normPhone, email], async (err, users) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    if (users.length > 0) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = "INSERT INTO users (phone, name, email, password) VALUES (?, ?, ?, ?)";
    conn.query(insertQuery, [normPhone, name, email, hashedPassword], (err) => {
      if (err) return res.status(500).json({ success: false, message: "User creation failed" });
      res.json({ success: true, message: "User created" });
    });
  });
});

app.post("/send-otp", async (req, res) => {
  let { phone } = req.body;
  phone = normalizePhone(phone);

  if (!phone) {
    return res.status(400).json({ success: false, message: "Invalid phone number" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: twilioPhone,
      to: phone
    });

    otpStore.set(phone, otp);
    setTimeout(() => otpStore.delete(phone), 5 * 60 * 1000);

    res.json({ success: true, message: "OTP sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: "OTP failed", details: error.message });
  }
});

app.post("/verify-otp", (req, res) => {
  let { phone, otp } = req.body;
  phone = normalizePhone(phone);

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: "Phone and OTP required" });
  }

  const storedOtp = otpStore.get(phone);
  if (storedOtp === otp) {
    otpStore.delete(phone);
    res.json({ success: true, message: "OTP verified" });
  } else {
    res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }
});

app.get("/current-user", (req, res) => {
  let { phone } = req.body;
  phone = normalizePhone(phone);
  const query = "SELECT name FROM users WHERE phone = ?";
  conn.query(query, [phone], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json(result.name);
  });
});

app.post("/login", (req, res) => {
  let { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ success: false, message: "Phone and password required" });
  }

  phone = normalizePhone(phone);
  if (!phone) return res.status(400).json({ success: false, message: "Invalid phone format" });

  const query = "SELECT * FROM users WHERE phone = ?";
  conn.query(query, [phone], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, matched) => {
      if (err || !matched) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      res.json({
        success: true,
        message: "✅ Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    });
  });
});

app.post("/submit-report", (req, res) => {
  const { description , id } = req.body;
  const query = "INSERT INTO report (description , user_id) VALUES (? , ?)";
  conn.query(query, [description , id ], (err, result) => {
    if (err) {
      console.error("Error inserting report:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    res.json({
      success: true,
      message: "Report submitted successfully",
      insertId: result.insertId
    });
  });
});

app.get("/submit-report", (req, res) => {
  const query = "SELECT * FROM report";
  conn.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching reports:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    res.json(result);
  });
});



app.post("/delete-report", (req, res) => {
    const {reportid} = req.body;

    const query = "DELETE FROM report where report_id = ? ";
    conn.query(query, [reportid] , (err, result) => {
      if (err) {
        console.error("Error fetching reports:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      res.json(result);
    });
  });





app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
