import { Pool } from 'pg';
import { logger } from '../utils/logger';

// For now, we'll use a mock database connection
// In production, this would connect to PostgreSQL
let pool: Pool | null = null;

export async function initializeDatabase(): Promise<void> {
  try {
    // Check if we have database credentials
    const databaseUrl = process.env.DATABASE_URL;
    
    if (databaseUrl) {
      // Real database connection
      pool = new Pool({
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });
      
      // Test connection
      await pool.query('SELECT NOW()');
      logger.info('Connected to PostgreSQL database');
    } else {
      // Mock database for development
      logger.info('Using mock database for development');
      pool = null;
    }
  } catch (error) {
    logger.warn('Database connection failed, using mock mode:', error);
    pool = null;
  }
}

export function getPool(): Pool | null {
  return pool;
}

export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    logger.info('Database connection closed');
  }
}
