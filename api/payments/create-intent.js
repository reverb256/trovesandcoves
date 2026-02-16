// Vercel serverless function for Stripe payments
import Stripe from 'stripe';

// CORS headers for GitHub Pages
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://reverb256.github.io',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

// Initialize Stripe with error handling
let stripe;
try {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });
} catch (error) {
  console.error('Stripe initialization error:', error);
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    return res.end();
  }

  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (!stripe) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ 
      error: 'Payment service unavailable' 
    }));
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  try {
    const { amount, currency = 'cad', metadata = {} } = req.body;

    if (!amount || amount <= 0) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ 
        error: 'Valid amount is required' 
      }));
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      metadata: {
        source: 'trovesandcoves',
        platform: 'github-pages',
        ...metadata
      },
      automatic_payment_methods: {
        enabled: true
      },
      payment_method_types: ['card'],
      receipt_email: metadata.customerEmail || undefined
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }));

  } catch (error) {
    console.error('Stripe payment intent error:', error);
    
    let errorMessage = 'Payment processing failed';
    if (error.type === 'StripeCardError') {
      errorMessage = error.message;
    } else if (error.type === 'StripeRateLimitError') {
      errorMessage = 'Service temporarily unavailable';
    } else if (error.type === 'StripeInvalidRequestError') {
      errorMessage = 'Invalid request';
    }

    res.writeHead(error.type === 'StripeCardError' ? 400 : 500, { 
      'Content-Type': 'application/json' 
    });
    return res.end(JSON.stringify({ 
      error: errorMessage,
      type: error.type,
      code: error.code
    }));
  }
}