# Newsletter Feature Design

**Date:** 2026-03-09
**Status:** Approved
**Author:** Design discussion with user

## Overview

Add a newsletter subscription feature to the Troves & Coves crystal jewelry website. Users can subscribe via a form in the footer to receive updates and receive a unique discount code for 10% off their next purchase.

## Architecture

### Backend Components

- **API Route**: New `POST /api/newsletter/subscribe` endpoint
- **Storage**: Extend `MemStorage` class with `newsletterSubscriptions` Map
- **Code Generation**: Unique discount code per subscriber (format: `CRYSTAL-XXXXX`)
- **Validation**: Email format and first name validation using existing security middleware

### Frontend Components

- Newsletter signup form integrated into existing Footer component
- Success message with generated discount code
- Copy-to-clipboard functionality for discount code
- Loading states and error handling

## Data Types

```typescript
interface NewsletterSubscription {
  id: number;
  email: string;
  firstName: string;
  discountCode: string;
  subscribedAt: Date;
  isActive: boolean;
}

interface SubscribeRequest {
  email: string;
  firstName: string;
}

interface SubscribeResponse {
  success: boolean;
  discountCode?: string;
  message?: string;
}
```

## User Flow

1. User sees newsletter signup form in footer
2. Enters email address and first name
3. Clicks "Subscribe" button
4. Form validates input format
5. POST request to `/api/newsletter/subscribe`
6. Server generates unique discount code
7. Server stores subscription in `MemStorage`
8. Server returns success response with discount code
9. Client displays success message with code
10. Client stores code in localStorage for future reference

## UI Design

### Footer Newsletter Form

**Placement**: Bottom of Footer component, above the designer credit

**Layout**:
```
┌─────────────────────────────────────────────┐
│  ✨ Subscribe to Receive Crystal Wisdom     │
│                                             │
│  [Email Input]  [First Name]  [Subscribe]  │
│                                             │
│  Join our community for exclusive offers,   │
│  new arrivals, and crystal healing guides.  │
└─────────────────────────────────────────────┘
```

**Success State**:
- Replaces form with mystical success message
- Displays unique discount code prominently: "Your code: CRYSTAL-ABC123"
- Copy-to-clipboard button
- Animated sparkle effect

**Error States**:
- Invalid email: "Please enter a valid email address"
- Already subscribed: "This email is already on our crystal journey ✨"
- Server error: "Mystical interference occurred. Please try again."

**Styling**:
- Matches existing Material You cream color scheme
- Uses `--accent-vibrant` for subscribe button
- Input fields with `--border-light` borders
- Error messages in warm mystical tone (red/orange)

## Discount Code System

### Code Format
- Pattern: `CRYSTAL-XXXXX` (5 random alphanumeric characters)
- Example: `CRYSTAL-A7F3B`, `CRYSTAL-Q2X9Z`
- Uniqueness: Server checks for collisions before assigning

### Code Benefits
- 10% discount on purchase
- Single-use per subscriber (enforced in future checkout logic)
- Stored in localStorage for easy retrieval
- Can be displayed in success message and copied to clipboard

## Error Handling

### Client-Side Validation
- Email format validation (regex pattern)
- First name required (min 1 character)
- First name max length (50 characters)
- Disable submit button until valid input

### Server-Side Validation
- Duplicate email detection
- Email format validation
- Sanitization of first name input
- Rate limiting (optional, using existing security middleware)

### Error Messages
All error messages maintain the mystical brand voice:
- Technical errors become "mystical interference"
- Success states include sparkle emojis and crystal references
- Tone matches existing product descriptions

## Testing Strategy

### Unit Tests (Vitest)
- `NewsletterAPI.test.ts`: Subscribe endpoint with valid/invalid data
- `DiscountCodeGenerator.test.ts`: Unique code generation and collision detection
- `Footer.test.ts`: Form validation and success/error states

### E2E Tests (Playwright)
- User subscribes with valid email + name
- Error displays for invalid email format
- Success message shows with unique discount code
- Already-subscribed email shows appropriate message
- Discount code persists in localStorage

### Manual Testing Checklist
- [ ] Form appears in footer on mobile and desktop
- [ ] Subscribe button disabled until valid input
- [ ] Success animation plays smoothly
- [ ] Copy-to-clipboard works for discount code
- [ ] Multiple signups generate different codes
- [ ] Brand colors and fonts match rest of site
- [ ] Form is accessible (keyboard navigation, screen readers)

## Implementation Considerations

### Type Safety
- Strict TypeScript compliance (no `any` types)
- All types defined in `shared/types.ts`
- Proper error typing with `unknown` instead of `any`

### Performance
- React.memo for Footer component (already implemented)
- Debounce validation on input fields
- Optimistic UI updates for better perceived performance

### Accessibility
- Proper ARIA labels on form inputs
- Keyboard navigation support
- Screen reader announcements for success/error states
- Sufficient color contrast for error messages

### Future Enhancements (Out of Scope for MVP)
- Email service integration (Mailchimp, SendGrid, etc.)
- Double opt-in confirmation
- Unsubscribe functionality
- Admin dashboard to view/export subscribers
- Email customization per subscriber interests
- Automated newsletter sending

## Success Criteria

- [ ] Newsletter form displays in footer on all pages
- [ ] Users can successfully subscribe with email + first name
- [ ] Each subscriber receives a unique discount code
- [ ] Success message displays with copy-to-clipboard functionality
- [ ] Error states handle edge cases appropriately
- [ ] All tests pass (unit and E2E)
- [ ] Type-safe implementation with no `any` types
- [ ] Matches existing design system and brand voice

## Notes

- This is a **placeholder implementation** for now - emails are stored in-memory only
- When production-ready, subscribers can be exported to CSV or integrated with email service
- Discount codes are generated but not yet enforced in checkout logic (future work)
- The mystical brand voice should carry through all user-facing text
