import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { pool } from '../src/db';

async function resetAdmin() {
    try {
        console.log("Deleting admin user...");
        await pool.query('DELETE FROM "user" WHERE email = $1', ['hemanthkumar2k04@gmail.com']);
        console.log("Admin user deleted.");
    } catch (error) {
        console.error("Error deleting user:", error);
    } finally {
        await pool.end();
    }
}

resetAdmin();
