import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,                        // max clients in pool
  idleTimeoutMillis: 60000,       // remove idle clients after 60s
  connectionTimeoutMillis: 20000, // wait up to 20s for a connection
  keepAlive: true
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to the database:', err.message);
  } else {
    console.log('✅ Successfully connected to PostgreSQL');
    release();
  }
});

// Set long statement_timeout for all clients
pool.on("connect", (client) => {
  client.query("SET statement_timeout TO '300000'").catch(err => {
    console.error('Failed to set statement_timeout:', err);
  });
});

// Optional: catch idle client errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
