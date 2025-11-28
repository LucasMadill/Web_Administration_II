// netlify/functions/add-user.js
import { neon } from '@neondatabase/serverless';

// Create a Neon client using the connection string from environment variables
// Make sure to set NEON_DATABASE_URL in Netlify's environment settings
const sql = neon(process.env.NEON_DATABASE_URL);

/**
 * Netlify Function to handle POST requests and insert data into Neon Postgres
 */
export async function handler(event) {
  try {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    // Parse and validate request body
    let data;
    try {
      data = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON body' }),
      };
    }

    const { name, email } = data;
    if (!name || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: name, email' }),
      };
    }

    // Insert into Postgres
    const result = await sql`
      INSERT INTO users (name, email)
      VALUES (${name}, ${email})
      RETURNING id, name, email, created_at
    `;

    return {
      statusCode: 201,
      body: JSON.stringify({ success: true, user: result[0] }),
    };
  } catch (err) {
    console.error('Database error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
}
