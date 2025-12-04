import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { auth } from '../src/auth';

async function migrate() {
    try {
        console.log("Running Better Auth migrations...");
        await auth.api.initializeTables();
        console.log("✓ Better Auth tables created successfully!");
    } catch (error) {
        console.error("Error during migration:", error);
        process.exit(1);
    }
}

migrate();
