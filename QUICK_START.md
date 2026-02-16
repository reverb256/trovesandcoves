# Quick Start Guide - Go Live in 15 Minutes

This guide will help you get the e-commerce system live and ready to accept payments in under 15 minutes.

## ⚡ 15-MINUTE QUICK START

### Step 1: Database Setup (5 minutes) ⏱️

**Choose Neon (Free & Recommended):**

1. Go to [neon.tech](https://neon.tech) and click "Sign Up"
2. After login, click "New Project"
3. Name it "trovesandcoves" and click "Create Project"
4. On the project dashboard, find "Connection string"
5. Click "Copy" on the connection string

**Set environment variable:**
```bash
# In your project root, create or update .env.local
echo "DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require" >> .env.local
```

**Push database schema:**
```bash
npm run db:push
```

✅ *Database is now ready!* (2 minutes elapsed)

---

### Step 2: Stripe Setup (5 minutes) ⏱️

**Get Stripe Keys:**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/dashboard)
2. Click "Developers" in the left sidebar
3. Click "API keys"
4. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`) → Copy this
   - **Secret key** (starts with `sk_test_`) → Copy this

**Add keys to .env.local:**
```bash
# Append to your .env.local file
echo "" >> .env.local
echo "# Stripe Payment Processing" >> .env.local
echo "STRIPE_SECRET_KEY=sk_test_your_key_here" >> .env.local
echo "VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here" >> .env.local
```

⚠️ **Important:** Replace `sk_test_your_key_here` and `pk_test_your_key_here` with your actual keys!

✅ *Stripe is now configured!* (5 minutes elapsed)

---

### Step 3: Test the Flow (3 minutes) ⏱️

**Start the development server:**
```bash
npm run dev
```

The server will start at `http://localhost:5000`

**Test the complete purchase flow:**

1. **Browse Products**
   - Go to http://localhost:5000/products
   - Click on any product to view details

2. **Add to Cart**
   - Click "Add to Cart"
   - Open cart drawer (top right icon)

3. **Proceed to Checkout**
   - Click "Proceed to Checkout" in cart drawer
   - Fill in the form:
     ```
     Email: test@example.com
     First Name: Test
     Last Name: Customer
     Phone: 555-123-4567
     Shipping Address:
       Street: 123 Main St
       City: Winnipeg
       Province: MB
       Postal Code: R3B 1A5
     ```

4. **Complete Test Payment**
   - Enter test card details:
     ```
     Card Number: 4242 4242 4242 4242
     Expiry: 12/25
     CVC: 123
     ZIP: R3B 1A5
     ```
   - Click "Complete Order - $XXX.XX"

5. **See Order Confirmation**
   - You'll be redirected to `/order-confirmation?order_id=1`
   - You should see order details, items, and confirmation message

✅ *Test successful! The e-commerce system works!* (10 minutes elapsed)

---

### Step 4: Go Live (5 minutes) ⏱️

**Switch to Live Stripe Keys:**

1. In Stripe Dashboard, click "API keys"
2. Click "Reveal live key" button
3. Copy the live keys:
   - `pk_live_...` (Publishable key)
   - `sk_live_...` (Secret key)

4. Update your .env.local:
```bash
# Replace test keys with live keys
STRIPE_SECRET_KEY=sk_live_your_live_key_here
VITE_STRIPE_PUBLIC_KEY=pk_live_your_live_key_here
```

**Deploy to Production:**

**Option A: GitHub Pages + Cloudflare Workers (Free)**
```bash
# Deploy frontend
npm run build:github-pages
npm run deploy:github-pages

# Deploy API
npm run deploy:cloudflare
```

**Option B: Traditional Server**
```bash
# Build production bundle
npm run build

# Start production server
NODE_ENV=production npm start
```

✅ *You're live! Ready to accept real payments!* (15 minutes elapsed)

---

## 🎯 YOU'RE DONE!

**Status:** ✅ **LIVE AND READY FOR REVENUE**

You now have:
- ✅ Working e-commerce system
- ✅ PostgreSQL database
- ✅ Stripe payment processing
- ✅ Order management
- ✅ Complete checkout flow
- ✅ Revenue-ready platform

## 💰 ACCEPTING REAL PAYMENTS

### Test Mode (Recommended First)
Keep using test keys (`sk_test_` and `pk_test_`) to:
- Test different payment scenarios
- Verify order creation
- Test email notifications (when configured)
- Practice checkout flow

### Live Mode (For Real Money)
Switch to live keys (`sk_live_` and `pk_live_`) when:
- ✅ Test mode is fully working
- ✅ All features tested
- ✅ Ready to accept real payments
- ✅ Business is ready to fulfill orders

## 📊 EXPECTED RESULTS

**After going live:**
- First payment: Immediate (someone makes a purchase)
- Email notifications: Instant (when configured)
- Order management: Real-time in database
- Revenue tracking: Track via Stripe dashboard

**Revenue estimate:**
- 10 orders/month @ $75 average = **$750/month**
- 25 orders/month @ $100 average = **$2,500/month**
- 50 orders/month @ $150 average = **$7,500/month**

## 🔧 MAINTENANCE

### Daily Tasks
- Check Stripe dashboard for successful payments
- Verify new orders in database
- Process and ship orders
- Respond to customer emails

### Weekly Tasks
- Review order analytics
- Update inventory as needed
- Check for failed payments
- Monitor site performance

### Monthly Tasks
- Review revenue reports
- Update product pricing
- Analyze customer feedback
- Plan inventory restocking

## 📞 NEED HELP?

**Documentation:**
- Full setup guide: `ECOMMERCE_SETUP.md`
- API documentation: `docs/api/README.md`
- Implementation summary: `IMPLEMENTATION_SUMMARY.md`

**Quick references:**
- Stripe Dashboard: https://dashboard.stripe.com
- Neon Dashboard: https://console.neon.tech
- Project repository: /data/@projects/trovesandcoves

**Common issues:**
- Database not connecting → Check DATABASE_URL is correct
- Stripe not working → Verify API keys match mode (test vs live)
- Orders not creating → Check cart has items before checkout

## ✅ CHECKLIST

Before going live, ensure:

- [ ] PostgreSQL database is connected (`npm run db:push` worked)
- [ ] Stripe keys are set (test or live mode)
- [ ] Complete checkout flow tested (from browse to confirmation)
- [ ] Test payment completed successfully
- [ ] Order confirmation page displays correctly
- [ ] Cart is cleared after successful payment
- [ ] Email notifications working (if configured)
- [ ] Site deployed to production
- [ ] Domain is pointing to deployed site
- [ ] SSL certificate is active (https)

**Check all boxes above = ✅ YOU'RE READY TO GO LIVE!**

---

**Time to complete setup: ~15 minutes**
**Time to first revenue: Immediately after going live**
**Estimated first month revenue: $750-7,500**

**Good luck with your crystal jewelry business! 🎉**
