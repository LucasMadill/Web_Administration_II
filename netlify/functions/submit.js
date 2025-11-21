// netlify/functions/submit.js
import { Client } from '@neondatabase/serverless';

export default async function handler(event, context) {
  // Allow only POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    const { name, email } = JSON.parse(event.body || '{}');

    // Basic validation
    if (!name || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Name and email are required' })
      };
    }

    // Connect to Neon DB
    const client = new Client(process.env.DATABASE_URL);
    await client.connect();

    // Insert data
    await client.query(
      'INSERT INTO users (name, email) VALUES ($1, $2)',
      [name, email]
    );

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data inserted successfully' })
    };
  } catch (err) {
    console.error('DB Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }
}
