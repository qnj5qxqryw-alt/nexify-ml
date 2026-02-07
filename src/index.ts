import express, { Request, Response } from "express";
import authRouter from "./routes/auth";
import weatherRouter from "./routes/weather";
import cors from "cors"; //
import dashboardRouter from "./routes/dashboard";
import leaderboardRouter from "./routes/leaderboard";
import aiRoutes from "./routes/ai";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/auth", authRouter);
app.use("/weather", weatherRouter);
app.use("/dashboard", dashboardRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/ai", aiRoutes);

app.get("/", (_,res) => {
    res.send("Nexify server is running🚀");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});