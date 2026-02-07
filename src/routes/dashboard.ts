import { Router } from "express";
import { authGuard } from "../middleware/auth";
import { getScore, getRank } from "../services/score";

import db from "../db/database";

const router = Router();

router.get("/", authGuard, (req, res) => {
    const userId = (req as any).user.id;
    const score = getScore(userId);

    const user = db
      .prepare("SELECT plan, plan_expires_at FRom users WHERE id = ?")
      .get(userId) as { plan: string; plan_expires_at: string | null };

      let welcomeMessage = "Welcome back👋";

      if (user.plan === "pro") {
        welcomeMessage = "You're a Pro user🚀Enjoy full access!";
      }

    res.json({
      message: "Dashboard loaded",
      welcome: welcomeMessage,
      SkyScore: score,
      rank: getRank(score),
      alertsToday: 2,
      plan: user?.plan ?? "free",
      planExpiresAt: user?.plan_expires_at,
    });
});      

export default router;