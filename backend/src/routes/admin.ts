import { Router } from 'express';
import { auth } from '../auth';
import { fromNodeHeaders } from "better-auth/node";
import { pool } from '../db';

const router = Router();

// Middleware to check if user is authenticated and is admin
router.use(async (req, res, next) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
    });

    if (!session) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    // TODO: Replace with your actual email
    const ADMIN_EMAIL = "hemanthkumar2k04@gmail.com"; 

    if (session.user.email !== ADMIN_EMAIL) {
        res.status(403).json({ error: "Forbidden: Admin access only" });
        return;
    }

    next();
});

router.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, "createdAt", "updatedAt" FROM "user"');
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
