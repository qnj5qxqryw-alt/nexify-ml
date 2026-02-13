import { Router } from "express";
import db from "../db/database";
import { getRank } from "../services/score";

const router = Router();

router.get("/", (_req, res) => {
  const users = db.prepare(`
    SELECT users.email, scores.score
    FROM scores
    JOIN users ON users.id = scores.user_id
    ORDER BY scores.score DESC
    LIMIT 10
  `).all();

  res.json(
    users.map((u: any) => ({
      email: u.email,
      score: u.score,
      rank: getRank(u.score)
    }))
  );
});

export default router;