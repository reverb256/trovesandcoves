import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { contactSubmissions } from '../../../shared/schema.js';
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// CORS headers for GitHub Pages
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://reverb256.github.io',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    return res.end();
  }

  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  try {
    const { name, email, phone, subject, message, isConsultation, preferredDate } = req.body;

    if (!name || !email || !subject || !message) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ 
        error: 'Name, email, subject, and message are required' 
      }));
    }

    const newSubmission = await db
      .insert(contactSubmissions)
      .values({
        name,
        email,
        phone: phone || null,
        subject,
        message,
        isConsultation: isConsultation || false,
        preferredDate: preferredDate ? new Date(preferredDate) : null
      })
      .returning();

    res.writeHead(201, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      message: "Thank you for your message! We'll get back to you soon.",
      id: newSubmission[0].id
    }));

  } catch (error) {
    console.error('Contact submission error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }));
  }
}