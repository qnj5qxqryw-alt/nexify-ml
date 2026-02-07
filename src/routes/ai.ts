import { Router } from "express";
import { authGuard } from "../middleware/auth";
import db from "../db/database";

const router = Router();

router.post("/chat", authGuard, (req, res) => {
  const userId = (req as any).user.id;
  const { message } = req.body;

  const scoreRow = db
    .prepare("SELECT score FROM scores WHERE user_id = ?")
    .get(userId) as { score: number };

   const reply = 
     scoreRow.score > 1000
       ? "You're doing great 🌟 Stay prepared!"
       : "Check weather more often to improve your Skyscore."

    res.json({ reply });
});

export default router;