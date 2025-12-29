//Imports
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js'
import User from "./models/User.js";
import { OAuth2Client } from "google-auth-library";
import crypto from 'crypto';
import cors from 'cors';

//config
dotenv.config();

// app config
const app = express();
app.use(express.json());
app.use(cors())

// Listening to the port 8000
const PORT = process.env.PORT || 8000;

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
} = process.env;

const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

const SCOPES = ["openid", "email", "profile"];

const stateStore = new Set();

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

app.get("/", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  stateStore.add(state);
  
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    state
    });

  res.redirect(authUrl);
});

app.get("/google/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state || !stateStore.has(state)) {
    return res.status(400).send("Invalid OAuth state.");
  }

  stateStore.delete(state);

  try {

    const { tokens } = await client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL
    });

    if (!tokens.id_token) {
      throw new Error("Missing ID token");
    }

     const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid token payload");

    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name
      });
    }

    res.redirect("http://localhost:3000/visa-officer");
  } catch (err) {
    console.error(err);
    res.status(500).send("Authentication failed");
  }
});

// Add this endpoint for mobile authentication
app.post("/auth/mobile", async (req, res) => {
  try {
    const { id_token } = req.body;
    
    if (!id_token) {
      return res.status(400).json({ 
        error: "Missing id_token" 
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: '211640976708-lelad1md8d7dqj8gqoompn7lnfkh0ier.apps.googleusercontent.com'
    });

    const payload = ticket.getPayload();
    
    if (!payload) {
      return res.status(401).json({ 
        error: "Invalid token" 
      });
    }

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        name
      });
    }
    
    await user.save();

    return res.json({message: "login successful"});

  } catch (error) {
    console.error("Mobile auth error:", error);
    
    if (error.message.includes("Token used too late")) {
      return res.status(401).json({ 
        error: "Token expired" 
      });
    }
    
    return res.status(500).json({ 
      error: "Authentication failed" 
    });
  }
});

// connect DB before server  starts
await connectDB();

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

