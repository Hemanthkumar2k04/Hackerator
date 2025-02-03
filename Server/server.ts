import express, { Request, Response } from "express";
import undici from "undici";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import NodeCache from "node-cache";
import compression from "compression";

const app = express();
const port = 5000;
const template = "I would like you to generate an idea on: ";
const MONGO_URI = "mongodb://127.0.0.1:27017/myDb";

// Cache for in-memory user data
const cache = new NodeCache({ stdTTL: 600 }); // Cache TTL of 10 minutes

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(bodyParser.json());

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    credits: { type: Number },
  },
  { collection: "Users" }
);

const User = mongoose.model("User", userSchema);

// Helper to cache users
const getCachedUser = async (username: string) => {
  let user = cache.get(username);
  if (!user) {
    user = await User.findOne({ username });
    if (user) cache.set(username, user);
  }
  return user;
};

// Routes
app.post("/message", (req: Request, res: Response): void => {
  const { message, user } = req.body;
  if (message) {
    console.log(`USER(${user}): ${message}`);
    res.status(200).send({ status: "success", message: "Message received" });
  } else {
    res.status(400).send({ status: "error" });
  }
});

app.post("/resetPassword", async (req: Request, res: Response): Promise<void> => {
  const { username, oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne(username);
    if (!user) {
      res.status(400).json({ message: "Username not found" });
      return;
    }
    if (user.password !== oldPassword) {
      res.status(401).json({ message: "Invalid Password" });
      return;
    }

    user.password = newPassword;
    await user.save();
    cache.del(username); // Clear cache after update
    console.log("Successful password reset");
    res.status(200).json({ message: "Password reset complete" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and Password Required" });
    return;
  }

  try {
    const user = await User.findOne(username);
    if (!user) {
      res.status(400).json({ message: "User Not Found!" });
      return;
    }

    if (password !== user.password) {
      res.status(401).json({ message: "Invalid Username or Password" });
      return;
    }

    console.log(username);
    res.status(200).json({ message: "Login Successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and Password Required" });
    return;
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(409).json({ message: "User already Exists!" });
      return;
    }

    const newUser = new User({ username, password, credits: 300 });
    await newUser.save();

    res.status(201).json({ message: "Registration Successful" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

const parseModelResponse = (data: string): string => {
  const lines = data.trim().split("\n");
  let finalResponse = "";

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.response) {
        finalResponse += parsed.response;
      }
    } catch {
      // Ignore invalid JSON lines
    }
  }

  return finalResponse.trim();
};

app.post("/generate", async (req, res) => {
  try {
    const { prompt, is_custom_prompt } = req.body;
    const finalPrompt = is_custom_prompt
      ? prompt
      : `${template}${prompt} and I would like the details of Project name, Short Description, what it actually solves, existing solutions, TECH STACK and whether it can be done in a 24 or 48 hr hackathon and your important suggestion on this project.`;

    const response = await undici.fetch("http://localhost:11434/api/generate", {
      method: "POST",
      body: JSON.stringify({
        model: "llama3.1:8b",
        prompt: finalPrompt,
        max_tokens: 25,
        num_ctx: 128,
      }),
      headers: { "Content-Type": "application/json", Connection: "keep-alive" },
    });

    const responseText = await response.text();
    res.json({ result: parseModelResponse(responseText) });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
