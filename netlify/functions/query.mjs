// netlify/functions/query.mjs
import { neon } from '@neondatabase/serverless';

/**
 * Netlify Function to query Neon PostgreSQL
 * Uses ES Modules (.mjs) syntax
 */
export async function handler(event, context) {
  try {
    // Ensure DATABASE_URL is set in Netlify environment variables
    const connectionString = process.env.NETLIFY_DATABASE_URL;
    if (!connectionString) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'DATABASE_URL environment variable is missing' }),
      };
    }

    // Create a Neon client
    const sql = neon(connectionString);

    // Example query: fetch current timestamp from Postgres
    const result = await sql`SELECT NOW() AS current_time`;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Query successful',
        data: result,
      }),
    };
  } catch (err) {
    console.error('Database query failed:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Database query failed', details: err.message }),
    };
  }
}
