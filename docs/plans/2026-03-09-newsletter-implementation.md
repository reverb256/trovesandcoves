# Newsletter Feature Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a newsletter subscription feature to the footer that captures email + first name and generates unique discount codes for subscribers.

**Architecture:** Extend the existing MemStorage pattern to store newsletter subscriptions, create a new API endpoint for subscription, and integrate a signup form into the Footer component with success/error states.

**Tech Stack:** React + TypeScript, Express.js, Vitest (unit tests), Playwright (E2E tests), existing shadcn/ui components

---

## Task 1: Add Newsletter Types to Shared Types

**Files:**

- Modify: `shared/types.ts`

**Step 1: Add newsletter subscription interfaces**

Open `shared/types.ts` and add these interfaces after the ContactSubmission interfaces (around line 200):

```typescript
// Newsletter subscriptions
export interface NewsletterSubscription {
  id: number;
  email: string;
  firstName: string;
  discountCode: string;
  subscribedAt: Date;
  isActive: boolean;
}

export interface InsertNewsletterSubscription {
  email: string;
  firstName: string;
}

export interface SubscribeRequest {
  email: string;
  firstName: string;
}

export interface SubscribeResponse {
  success: boolean;
  discountCode?: string;
  message?: string;
}
```

**Step 2: Update IStorage interface**

Add these method signatures to the `IStorage` interface (around line 50):

```typescript
// Newsletter operations
  createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;
  getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined>;
  getNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;
```

**Step 3: Commit**

```bash
git add shared/types.ts
git commit -m "feat: add newsletter subscription types"
```

---

## Task 2: Extend MemStorage with Newsletter Support

**Files:**

- Modify: `server/storage.ts`

**Step 1: Add newsletter storage field**

In the `MemStorage` class private fields section (around line 26), add:

```typescript
private newsletterSubscriptions: Map<number, NewsletterSubscription>;
private currentNewsletterId: number;
```

**Step 2: Initialize in constructor**

In the constructor (around line 43), add:

```typescript
this.newsletterSubscriptions = new Map();
this.currentNewsletterId = 1;
```

**Step 3: Add discount code generation utility**

Add this private method to the MemStorage class (after the seedData method, around line 267):

```typescript
private generateDiscountCode(): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No ambiguous chars
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `CRYSTAL-${code}`;
}
```

**Step 4: Implement newsletter storage methods**

Add these methods at the end of the MemStorage class (after getContactSubmissions, around line 555):

```typescript
// Newsletter operations
async createNewsletterSubscription(insertSubscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
  // Check for existing subscription
  const existing = await this.getNewsletterSubscriptionByEmail(insertSubscription.email);
  if (existing) {
    throw new Error("Email already subscribed");
  }

  const id = this.currentNewsletterId++;
  const discountCode = this.generateDiscountCode();

  const subscription: NewsletterSubscription = {
    id,
    email: insertSubscription.email,
    firstName: insertSubscription.firstName,
    discountCode,
    subscribedAt: new Date(),
    isActive: true
  };

  this.newsletterSubscriptions.set(id, subscription);
  return subscription;
}

async getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined> {
  return Array.from(this.newsletterSubscriptions.values()).find(
    sub => sub.email === email && sub.isActive
  );
}

async getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
  return Array.from(this.newsletterSubscriptions.values()).filter(sub => sub.isActive);
}
```

**Step 5: Commit**

```bash
git add server/storage.ts
git commit -m "feat: add newsletter storage to MemStorage"
```

---

## Task 3: Add Newsletter API Route

**Files:**

- Modify: `server/routes.ts`

**Step 1: Add import**

At the top of `server/routes.ts`, add to the imports from storage:

```typescript
import { storage } from './storage';
```

**Step 2: Add newsletter subscription route**

Add this route after the contact submission routes (around line 150):

```typescript
// Newsletter subscription endpoint
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email, firstName } = req.body;

    // Validate input
    if (!email || !firstName) {
      return res.status(400).json({
        success: false,
        message: 'Email and first name are required',
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address',
      });
    }

    // First name validation
    if (firstName.trim().length < 1 || firstName.trim().length > 50) {
      return res.status(400).json({
        success: false,
        message: 'First name must be between 1 and 50 characters',
      });
    }

    // Create subscription
    const subscription = await storage.createNewsletterSubscription({
      email: email.toLowerCase().trim(),
      firstName: firstName.trim(),
    });

    res.json({
      success: true,
      discountCode: subscription.discountCode,
      message: 'Welcome to our crystal community!',
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'Email already subscribed'
    ) {
      return res.status(409).json({
        success: false,
        message: 'This email is already on our crystal journey ✨',
      });
    }

    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Mystical interference occurred. Please try again.',
    });
  }
});
```

**Step 3: Commit**

```bash
git add server/routes.ts
git commit -m "feat: add newsletter subscription API endpoint"
```

---

## Task 4: Create Newsletter Hook

**Files:**

- Create: `client/src/hooks/useNewsletter.ts`

**Step 1: Create the newsletter hook**

Create the file `client/src/hooks/useNewsletter.ts` with:

```typescript
import { useState } from 'react';
import type { SubscribeRequest, SubscribeResponse } from '@shared/types';

export function useNewsletter() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  const subscribe = async (
    data: SubscribeRequest
  ): Promise<SubscribeResponse> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setDiscountCode(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: SubscribeResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Subscription failed');
      }

      if (result.success && result.discountCode) {
        setSuccess(true);
        setDiscountCode(result.discountCode);

        // Store in localStorage for future reference
        localStorage.setItem('newsletterDiscountCode', result.discountCode);
        localStorage.setItem('newsletterEmail', data.email);
      }

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (code: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(code);
      return true;
    } catch {
      return false;
    }
  };

  const reset = () => {
    setSuccess(false);
    setError(null);
    setDiscountCode(null);
  };

  return {
    subscribe,
    isLoading,
    error,
    success,
    discountCode,
    copyToClipboard,
    reset,
  };
}
```

**Step 2: Commit**

```bash
git add client/src/hooks/useNewsletter.ts
git commit -m "feat: add useNewsletter hook"
```

---

## Task 5: Create Newsletter Form Component

**Files:**

- Create: `client/src/components/NewsletterForm.tsx`

**Step 1: Create the newsletter form component**

Create the file `client/src/components/NewsletterForm.tsx` with:

```typescript
import { useState, FormEvent } from 'react';
import { useNewsletter } from '@/hooks/useNewsletter';
import { Mail, User, Sparkles, Check, Copy } from 'lucide-react';

export function NewsletterForm() {
  const { subscribe, isLoading, error, success, discountCode, copyToClipboard, reset } = useNewsletter();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSavedCode, setShowSavedCode] = useState(false);

  // Check for previously saved code
  const savedCode = typeof window !== 'undefined'
    ? localStorage.getItem('newsletterDiscountCode')
    : null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await subscribe({ email, firstName });
  };

  const handleCopyCode = async (code: string) => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isFormValid = email.length > 0 && firstName.length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (success && discountCode) {
    return (
      <div className="bg-[hsla(var(--accent-vibrant),0.1)] border border-[hsla(var(--accent-vibrant),0.3)] rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[hsla(var(--accent-vibrant),0.2)] flex items-center justify-center">
            <Check className="w-8 h-8 text-[hsl(var(--accent-medium))]" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-[hsl(var(--text-primary))] mb-2">
          Welcome to the Crystal Community! ✨
        </h3>

        <p className="text-[hsl(var(--text-secondary))] mb-4">
          Thank you for joining us on this mystical journey, {firstName}!
        </p>

        <div className="bg-[hsl(var(--bg-primary))] border-2 border-dashed border-[hsla(var(--accent-vibrant),0.4)] rounded-lg p-4 mb-4">
          <p className="text-sm text-[hsl(var(--text-secondary))] mb-2">
            Your exclusive 10% discount code:
          </p>
          <div className="flex items-center justify-center gap-2">
            <code className="text-2xl font-bold text-[hsl(var(--accent-medium))]">
              {discountCode}
            </code>
            <button
              onClick={() => handleCopyCode(discountCode)}
              className="p-2 hover:bg-[hsla(var(--accent-vibrant),0.1)] rounded-lg transition-colors"
              aria-label="Copy discount code"
            >
              {copied ? (
                <Check className="w-5 h-5 text-[hsl(var(--accent-medium))]" />
              ) : (
                <Copy className="w-5 h-5 text-[hsl(var(--text-secondary))]" />
              )}
            </button>
          </div>
          {copied && (
            <p className="text-sm text-[hsl(var(--accent-medium))] mt-2">
              Copied to clipboard! ✓
            </p>
          )}
        </div>

        <p className="text-sm text-[hsl(var(--text-secondary))]/70">
          Use this code at checkout for 10% off your next purchase.
          <br />
          We've also saved it for you in your browser.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-[hsla(var(--border-light),0.3)] pt-8">
      <div className="max-w-md mx-auto text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-[hsl(var(--accent-medium))]" />
          <h3 className="text-lg font-semibold text-[hsl(var(--text-secondary))]">
            Subscribe to Receive Crystal Wisdom
          </h3>
          <Sparkles className="w-5 h-5 text-[hsl(var(--accent-medium))]" />
        </div>
        <p className="text-sm text-[hsl(var(--text-secondary))]/70">
          Join our community for exclusive offers, new arrivals, and crystal healing guides.
        </p>
      </div>

      {savedCode && !showSavedCode && (
        <div className="max-w-md mx-auto mb-4 p-3 bg-[hsla(var(--accent-vibrant),0.1)] border border-[hsla(var(--accent-vibrant),0.3)] rounded-lg text-center">
          <p className="text-sm text-[hsl(var(--text-secondary))] mb-2">
            You already have a discount code saved:
          </p>
          <button
            onClick={() => setShowSavedCode(true)}
            className="text-[hsl(var(--accent-medium))] font-semibold hover:underline"
          >
            View Your Code →
          </button>
        </div>
      )}

      {showSavedCode && savedCode && (
        <div className="max-w-md mx-auto mb-4 p-4 bg-[hsl(var(--bg-primary))] border border-[hsla(var(--accent-vibrant),0.3)] rounded-lg text-center">
          <p className="text-sm text-[hsl(var(--text-secondary))] mb-2">
            Your saved discount code:
          </p>
          <code className="text-xl font-bold text-[hsl(var(--accent-medium))]">
            {savedCode}
          </code>
          <button
            onClick={() => handleCopyCode(savedCode)}
            className="ml-2 p-2 hover:bg-[hsla(var(--accent-vibrant),0.1)] rounded-lg transition-colors"
            aria-label="Copy discount code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-[hsl(var(--accent-medium))]" />
            ) : (
              <Copy className="w-4 h-4 text-[hsl(var(--text-secondary))]" />
            )}
          </button>
          {copied && (
            <p className="text-xs text-[hsl(var(--accent-medium))] mt-2">
              Copied! ✓
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-secondary))]/50 pointer-events-none" />
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[hsl(var(--bg-primary))] border border-[hsla(var(--border-light),0.4)] rounded-lg text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-secondary))]/50 focus:outline-none focus:ring-2 focus:ring-[hsla(var(--accent-vibrant),0.5)] focus:border-transparent transition-all"
              disabled={isLoading}
            />
          </div>

          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-secondary))]/50 pointer-events-none" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[hsl(var(--bg-primary))] border border-[hsla(var(--border-light),0.4)] rounded-lg text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-secondary))]/50 focus:outline-none focus:ring-2 focus:ring-[hsla(var(--accent-vibrant),0.5)] focus:border-transparent transition-all"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="px-6 py-2.5 bg-[hsl(var(--accent-vibrant))] text-[hsl(var(--bg-primary))] font-semibold rounded-lg hover:bg-[hsl(var(--accent-medium))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </form>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add client/src/components/NewsletterForm.tsx
git commit -m "feat: add NewsletterForm component"
```

---

## Task 6: Integrate Newsletter Form into Footer

**Files:**

- Modify: `client/src/components/Footer.tsx`

**Step 1: Add import**

Add this import at the top of Footer.tsx (after the existing imports, around line 9):

```typescript
import { NewsletterForm } from './NewsletterForm';
```

**Step 2: Add newsletter form to footer**

Insert the NewsletterForm component before the bottom footer section (before line 172, where `/* Bottom Footer */` comment is):

```typescript
        {/* Newsletter Signup */}
        <NewsletterForm />
```

**Step 3: Commit**

```bash
git add client/src/components/Footer.tsx
git commit -m "feat: integrate newsletter form into footer"
```

---

## Task 7: Write Unit Tests for Newsletter Hook

**Files:**

- Create: `client/src/hooks/useNewsletter.test.ts`

**Step 1: Create the test file**

Create `client/src/hooks/useNewsletter.test.ts` with:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useNewsletter } from './useNewsletter';

// Mock fetch
global.fetch = vi.fn();

describe('useNewsletter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useNewsletter());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.success).toBe(false);
    expect(result.current.discountCode).toBe(null);
  });

  it('should successfully subscribe to newsletter', async () => {
    const mockResponse = {
      success: true,
      discountCode: 'CRYSTAL-ABC12',
      message: 'Welcome!',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const { result } = renderHook(() => useNewsletter());

    await act(async () => {
      const response = await result.current.subscribe({
        email: 'test@example.com',
        firstName: 'Test',
      });
      expect(response).toEqual(mockResponse);
    });

    expect(result.current.success).toBe(true);
    expect(result.current.discountCode).toBe('CRYSTAL-ABC12');
    expect(localStorage.getItem('newsletterDiscountCode')).toBe(
      'CRYSTAL-ABC12'
    );
    expect(localStorage.getItem('newsletterEmail')).toBe('test@example.com');
  });

  it('should handle email validation error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        message: 'Please enter a valid email address',
      }),
    } as Response);

    const { result } = renderHook(() => useNewsletter());

    await act(async () => {
      await expect(
        result.current.subscribe({
          email: 'invalid-email',
          firstName: 'Test',
        })
      ).rejects.toThrow('Please enter a valid email address');
    });

    expect(result.current.error).toBe('Please enter a valid email address');
    expect(result.current.success).toBe(false);
  });

  it('should handle already subscribed error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({
        success: false,
        message: 'This email is already on our crystal journey ✨',
      }),
    } as Response);

    const { result } = renderHook(() => useNewsletter());

    await act(async () => {
      await expect(
        result.current.subscribe({
          email: 'existing@example.com',
          firstName: 'Test',
        })
      ).rejects.toThrow('This email is already on our crystal journey ✨');
    });

    expect(result.current.error).toBe(
      'This email is already on our crystal journey ✨'
    );
  });

  it('should copy discount code to clipboard', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(true);
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    const { result } = renderHook(() => useNewsletter());

    let copyResult;
    await act(async () => {
      copyResult = await result.current.copyToClipboard('CRYSTAL-TEST');
    });

    expect(copyResult).toBe(true);
    expect(mockWriteText).toHaveBeenCalledWith('CRYSTAL-TEST');
  });

  it('should reset state', () => {
    const { result } = renderHook(() => useNewsletter());

    act(() => {
      result.current.reset();
    });

    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.discountCode).toBe(null);
  });
});
```

**Step 2: Run tests**

```bash
npm run test -- client/src/hooks/useNewsletter.test.ts
```

Expected: All tests pass

**Step 3: Commit**

```bash
git add client/src/hooks/useNewsletter.test.ts
git commit -m "test: add unit tests for useNewsletter hook"
```

---

## Task 8: Write Unit Tests for Storage

**Files:**

- Create: `server/storage.test.ts`

**Step 1: Create the test file**

Create `server/storage.test.ts` with:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { MemStorage } from './storage';

describe('Newsletter Storage', () => {
  let storage: MemStorage;

  beforeEach(() => {
    storage = new MemStorage();
  });

  it('should create newsletter subscription', async () => {
    const subscription = await storage.createNewsletterSubscription({
      email: 'test@example.com',
      firstName: 'Test',
    });

    expect(subscription).toBeDefined();
    expect(subscription.email).toBe('test@example.com');
    expect(subscription.firstName).toBe('Test');
    expect(subscription.discountCode).toMatch(/^CRYSTAL-[A-Z0-9]{5}$/);
    expect(subscription.isActive).toBe(true);
    expect(subscription.id).toBeDefined();
    expect(subscription.subscribedAt).toBeInstanceOf(Date);
  });

  it('should generate unique discount codes', async () => {
    const subscription1 = await storage.createNewsletterSubscription({
      email: 'test1@example.com',
      firstName: 'Test1',
    });

    const subscription2 = await storage.createNewsletterSubscription({
      email: 'test2@example.com',
      firstName: 'Test2',
    });

    expect(subscription1.discountCode).not.toBe(subscription2.discountCode);
  });

  it('should reject duplicate email subscriptions', async () => {
    await storage.createNewsletterSubscription({
      email: 'test@example.com',
      firstName: 'Test',
    });

    await expect(
      storage.createNewsletterSubscription({
        email: 'test@example.com',
        firstName: 'Test',
      })
    ).rejects.toThrow('Email already subscribed');
  });

  it('should retrieve subscription by email', async () => {
    await storage.createNewsletterSubscription({
      email: 'test@example.com',
      firstName: 'Test',
    });

    const found =
      await storage.getNewsletterSubscriptionByEmail('test@example.com');

    expect(found).toBeDefined();
    expect(found?.email).toBe('test@example.com');
  });

  it('should return undefined for non-existent email', async () => {
    const found = await storage.getNewsletterSubscriptionByEmail(
      'nonexistent@example.com'
    );
    expect(found).toBeUndefined();
  });

  it('should retrieve all subscriptions', async () => {
    await storage.createNewsletterSubscription({
      email: 'test1@example.com',
      firstName: 'Test1',
    });

    await storage.createNewsletterSubscription({
      email: 'test2@example.com',
      firstName: 'Test2',
    });

    const subscriptions = await storage.getNewsletterSubscriptions();

    expect(subscriptions).toHaveLength(2);
    expect(subscriptions[0].email).toBe('test1@example.com');
    expect(subscriptions[1].email).toBe('test2@example.com');
  });

  it('should only return active subscriptions', async () => {
    const sub1 = await storage.createNewsletterSubscription({
      email: 'test1@example.com',
      firstName: 'Test1',
    });

    await storage.createNewsletterSubscription({
      email: 'test2@example.com',
      firstName: 'Test2',
    });

    // Manually deactivate first subscription (this would be done via an update method in production)
    (storage as any).newsletterSubscriptions.get(sub1.id)!.isActive = false;

    const subscriptions = await storage.getNewsletterSubscriptions();

    expect(subscriptions).toHaveLength(1);
    expect(subscriptions[0].email).toBe('test2@example.com');
  });
});
```

**Step 2: Run tests**

```bash
npm run test -- server/storage.test.ts
```

Expected: All tests pass

**Step 3: Commit**

```bash
git add server/storage.test.ts
git commit -m "test: add unit tests for newsletter storage"
```

---

## Task 9: Write E2E Tests for Newsletter

**Files:**

- Create: `client/e2e/newsletter.spec.ts`

**Step 1: Create the E2E test file**

Create `client/e2e/newsletter.spec.ts` with:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Newsletter Signup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays newsletter form in footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(
      footer.getByText('Subscribe to Receive Crystal Wisdom')
    ).toBeVisible();
    await expect(footer.getByPlaceholder('First Name')).toBeVisible();
    await expect(footer.getByPlaceholder('Email Address')).toBeVisible();
    await expect(
      footer.getByRole('button', { name: 'Subscribe' })
    ).toBeVisible();
  });

  test('validates email format', async ({ page }) => {
    const footer = page.locator('footer');

    await footer.getByPlaceholder('First Name').fill('Test');
    await footer.getByPlaceholder('Email Address').fill('invalid-email');

    const subscribeButton = footer.getByRole('button', { name: 'Subscribe' });
    await expect(subscribeButton).toBeDisabled();
  });

  test('enables subscribe button with valid input', async ({ page }) => {
    const footer = page.locator('footer');

    await footer.getByPlaceholder('First Name').fill('Test');
    await footer.getByPlaceholder('Email Address').fill('test@example.com');

    const subscribeButton = footer.getByRole('button', { name: 'Subscribe' });
    await expect(subscribeButton).toBeEnabled();
  });

  test('shows success message with discount code', async ({ page }) => {
    const footer = page.locator('footer');

    await footer.getByPlaceholder('First Name').fill('Test');
    await footer
      .getByPlaceholder('Email Address')
      .fill(`test-${Date.now()}@example.com`);

    await footer.getByRole('button', { name: 'Subscribe' }).click();

    // Wait for success message
    await expect(
      footer.getByText('Welcome to the Crystal Community!')
    ).toBeVisible();
    await expect(
      footer.getByText(/Your exclusive 10% discount code:/)
    ).toBeVisible();
    await expect(footer.getByText(/CRYSTAL-/)).toBeVisible();
  });

  test('copies discount code to clipboard', async ({ page }) => {
    const footer = page.locator('footer');

    await footer.getByPlaceholder('First Name').fill('Test');
    await footer
      .getByPlaceholder('Email Address')
      .fill(`test-${Date.now()}@example.com`);

    await footer.getByRole('button', { name: 'Subscribe' }).click();

    // Wait for discount code to appear
    await footer.waitForSelector('code');

    // Get the discount code
    const codeElement = footer.locator('code');
    const code = await codeElement.textContent();

    // Click copy button
    await footer.getByRole('button', { name: /copy/i }).first().click();

    // Verify copied message
    await expect(footer.getByText('Copied to clipboard!')).toBeVisible();

    // Verify clipboard content
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText()
    );
    expect(clipboardText).toBe(code);
  });

  test('shows error for already subscribed email', async ({ page }) => {
    const footer = page.locator('footer');
    const email = 'duplicate@example.com';

    // First subscription
    await footer.getByPlaceholder('First Name').fill('Test');
    await footer.getByPlaceholder('Email Address').fill(email);
    await footer.getByRole('button', { name: 'Subscribe' }).click();

    // Wait for success
    await expect(
      footer.getByText('Welcome to the Crystal Community!')
    ).toBeVisible();

    // Reload and try to subscribe again with same email
    await page.reload();
    await footer.getByPlaceholder('First Name').fill('Test');
    await footer.getByPlaceholder('Email Address').fill(email);
    await footer.getByRole('button', { name: 'Subscribe' }).click();

    // Should show error message
    await expect(
      footer.getByText(/already on our crystal journey/)
    ).toBeVisible();
  });

  test('displays saved discount code', async ({ page }) => {
    const footer = page.locator('footer');

    // Subscribe once
    await footer.getByPlaceholder('First Name').fill('Test');
    await footer
      .getByPlaceholder('Email Address')
      .fill(`test-${Date.now()}@example.com`);
    await footer.getByRole('button', { name: 'Subscribe' }).click();

    await expect(footer.getByText(/CRYSTAL-/)).toBeVisible();

    // Reload page
    await page.reload();

    // Should show message about saved code
    await expect(
      footer.getByText(/You already have a discount code saved/)
    ).toBeVisible();

    // Click to view
    await footer.getByRole('button', { name: /View Your Code/i }).click();

    // Should show the saved code
    await expect(footer.locator('code')).toBeVisible();
  });
});
```

**Step 2: Run E2E tests**

```bash
npm run test:e2e -- client/e2e/newsletter.spec.ts
```

Expected: All tests pass

**Step 3: Commit**

```bash
git add client/e2e/newsletter.spec.ts
git commit -m "test: add E2E tests for newsletter feature"
```

---

## Task 10: Manual Testing & Verification

**Files:**

- None (manual verification)

**Step 1: Start development server**

```bash
npm run dev
```

**Step 2: Test in browser**

Open http://localhost:5173 and verify:

1. Newsletter form appears in footer on mobile and desktop
2. Form validation works (button disabled until valid input)
3. Can subscribe with valid email + first name
4. Success message displays with discount code
5. Copy-to-clipboard button works
6. Discount code is saved to localStorage
7. Reload shows "you already have a code" message
8. Trying to subscribe with same email shows error
9. Brand colors and styling match rest of site
10. Form is accessible (keyboard navigation works)

**Step 4: Check TypeScript compilation**

```bash
npm run check
```

Expected: No type errors

**Step 5: Run all tests**

```bash
npm run test
npm run test:e2e
```

Expected: All tests pass

**Step 6: Build production version**

```bash
npm run build
```

Expected: Build succeeds without errors

**Step 7: Commit**

```bash
git add -A
git commit -m "test: complete manual testing and verification"
```

---

## Task 11: Update Documentation

**Files:**

- Modify: `CLAUDE.md`

**Step 1: Update CLAUDE.md**

Add to the "What This Project Actually Is" section (around line 15):

```markdown
- Newsletter signup with unique discount code generation
```

Add to the "Key Patterns" section (around line 100):

```markdown
4. **Newsletter Subscriptions**: `server/storage.ts` manages newsletter subscriptions
   - Unique discount code per subscriber (format: CRYSTAL-XXXXX)
   - Email validation and duplicate detection
   - Codes stored in localStorage for subscriber convenience
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with newsletter feature info"
```

---

## Success Criteria Checklist

After completing all tasks, verify:

- [ ] Newsletter form displays in footer on all pages
- [ ] Users can successfully subscribe with email + first name
- [ ] Each subscriber receives a unique discount code (CRYSTAL-XXXXX format)
- [ ] Success message displays with copy-to-clipboard functionality
- [ ] Discount codes persist in localStorage
- [ ] Error states handle invalid emails and duplicate subscriptions
- [ ] All unit tests pass (Vitest)
- [ ] All E2E tests pass (Playwright)
- [ ] TypeScript compilation succeeds with no errors
- [ ] Production build succeeds
- [ ] Type-safe implementation with no `any` types
- [ ] Matches existing design system and brand voice
- [ ] Form is accessible (keyboard navigation, ARIA labels)

## Notes

- This is a placeholder implementation - emails are stored in-memory only
- For production, subscribers should be exported to CSV or integrated with an email service
- Discount codes are generated but not yet enforced in checkout logic
- The mystical brand voice carries through all user-facing text
- Newsletter form integrates seamlessly with existing footer design
