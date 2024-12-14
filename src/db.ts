import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

const db = new Database('sqlite.db');

export default drizzle(db, { logger: false });
