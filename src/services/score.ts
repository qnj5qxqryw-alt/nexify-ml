import db from "../db/database";

export function addScore(userId: number, points: number) {
  db.prepare(
    `INSERT INTO scores (user_id,score)
     VALUES (?, ?)
     ON CONFLICT(user_id)
     DO UPDATE SET score = score + ?
   `).run(userId, points, points);  
}

export function getScore(userId: number) {
  const row = db.prepare(
    "SELECT score FROM scores WHERE user_id = ?"
  ).get(userId) as { score: number} | undefined

  return row ? row.score : 0;
}

export function getRank(score: number) {
  if (score < 1000) return "Observer";
  if (score < 5000) return "Analyst";
  if (score < 15000) return "Sky Sentinel";
  return "Cloud Watcher"
}