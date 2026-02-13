import { Router } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import db from "../db/database";
import { signToken } from "../utils/jwt";
import { error } from "console";

const router = Router();

// Register
router.post("/register", (req, res) => {
  console.log("REGISTER BODY:", req.body)

  const { email, password, referralCode } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  // Check if user exists
  const existingUser =
  db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (existingUser) {
    return res.status(400).json({ error: "Email is already registered" });
  }

  //Find referrer (optional)
  let referrerId: number | null = null;

  if (referralCode) {
    const referrer = db
      .prepare("SELECT id FROM users WHERE referral_code = ?")
      .get(referralCode) as { id: number } | undefined; 
    if (referrer) {
      referrerId = referrer.id
    }  
  }
  
  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  // Generate referral code for new user
  const myReferralCode = crypto.randomBytes(4).toString("hex");

  try {
    // Create user
    const result = db
      .prepare(
        "INSERT INTO users (email, password, referral_code) VALUES (?, ?, ?)"
      )
      .run(email, hashedPassword, myReferralCode);
    
    const userId = Number(result.lastInsertRowid);

    // Create initial score row
    db.prepare(
      "INSERT INTO scores (user_id, score, streak) VALUES (?, ?, ?)"
    ).run(userId, 0, 0);

    // Handle referral rewards
    if (referrerId) {
      // Save referral
      db.prepare(
        "INSERT INTO referrals (referrer_id, referred_id) VALUES (?, ?)"
      ).run(referrerId, userId);

      // +50 SkyScore per referral
      db.prepare(
        "UPDATE scores SET score = score + 50 WHERE user_id = ?"
      ).run(referrerId);
      
      // Count referrals
      const referralCount = db
        .prepare(
          "SELECT COUNT(*) as count FROM referrals WHERE referrer_id = ?"
        )
        .get(referrerId) as { count: number };

      // Get referrer plan
      const referrerUser = db
        .prepare("SELECT plan FROM users WHERE id = ?")
        .get(referrerId) as { plan: string };
        
      // Grant ONE-TIME free month only if still on free plan
      if (referralCount.count >= 5 && referrerUser.plan === "free") {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30 );

        db.prepare(
          "UPDATE users SET plan = ?, plan_expires_at = ? WHERE id = ?"
        ).run("pro", expiresAt.toISOString(), referrerId);
      }
    }

    res.json({
      message: "User created",
      userId,
      referralCode: myReferralCode
    });
 } catch (e) {
  console.error("Registration Error:", e);
   res.status(500).json({ error: "Something went wrong on the server "});
 }
});

// Login
router.post("/login", (req, res) => {
   const { email, password } = req.body;

   const user = db
     .prepare("SELECT * FROM users WHERE email = ?")
     .get(email) as any;
     
   if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
   }
   
   const match = bcrypt.compareSync(password, user.password);
   if (!match) {
     return res.status(400).json({ error: "Invalid credentials" }); 
   }

   const token = signToken({ id: user.id });

   res.json({ token });
});

export default router;