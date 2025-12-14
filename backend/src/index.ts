import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:8000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

app.use(express.json());

import adminRoutes from './routes/admin';
import ideasRoutes from './routes/ideas';
import projectsRoutes from './routes/projects';
import workspaceRoutes from './routes/workspace';

app.use("/api/auth", toNodeHandler(auth));
app.use("/api/admin", adminRoutes);
app.use("/api/ideas", ideasRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/workspace", workspaceRoutes);

app.get('/', (req, res) => {
  res.send('Hackerator Backend is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
