import express from "express";
import dotenv from 'dotenv';
import pool from "./db";
import cors from "cors";
import { url } from "inspector";
dotenv.config()
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
const port = process.env.DB_PORT;


app.get('/', (req, res)=>{
    res.json({message : "TypeScript API running 🚀"})
})

app.get('/users', async(req, res)=>{
    try {
        const [rows] = await pool.query("SELECT * FROM users")
        res.json(rows)
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Server error" });
    }
})

app.post('/users', async(req, res)=>{
    const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: "username and email are required" });
  }

  try {
    const [result]: any = await pool.query(
      "INSERT INTO users (username, email) VALUES (?, ?)",
      [username, email]
    );

    res.status(201).json({
      id: result.insertId,
      username,
      email
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen("3000", ()=>{
    console.log("Listening on port 3000")
})