import axios from "axios";
import { Router } from "express";
import db from "../db/database";
import { authGuard } from "../middleware/auth";
import { addScore } from "../services/score";
import { predictStorm } from "../utils/ml";

const router = Router();

//Save weather
router.post("/", (req, res) => {
    const { userId, city, temperature, description} = req.body;

    db.prepare(`
        INSERT INTO weather (user_id, city, temperature, description)
        VALUES (?, ?, ?, ?)
        `).run(userId, city, temperature, description);
    res.json({ message: "Weather saved 🌦"});    
});

// Get weather for a user
router.get("/:userId", (req, res) => {
    const weather = db 
      .prepare("SELECT * FROM weather WHERE user_id = ?")
      .all(req.params.userId);
    res.json(weather);
});

// AI prediction
router.post("/predict", authGuard, async (req, res) => {
addScore((res.req as any).userId,5);
   try {
     const result = await predictStorm(req.body);
     res.json(result);
   } catch (err) {
     res.status(500).json({ error: "Prediction failed" });
   }  
});
 
export default router;