---
name: Admin Dashboard + ChatGPT MCP
about: Non-technical content management for Robin
title: 'Admin Dashboard + ChatGPT MCP: Non-technical content management for Robin'
labels: enhancement, admin, mcp, priority-high
milestone: Q2 2026 - Content Management
---

## 🎯 Objective

Enable Robin (non-technical user) to manage the Troves & Coves store content without touching code, while maintaining the static-site architecture and git-based deployment workflow.

## 🏗️ Architecture Overview

Two complementary interfaces:
1. **Admin Dashboard** - Web UI for direct content management
2. **ChatGPT MCP** - Natural language interface via MCP protocol

Both write to the same git-based data layer, triggering the existing CI/CD pipeline.

---

## 📋 Scope

### Phase 1: Data Layer Foundation

**Move from hardcoded TS to JSON data files:**

- [ ] Create `data/products.json` - replace `client/src/lib/products.ts`
- [ ] Create `data/site-config.json` - theme, banner text, featured collections
- [ ] Create `data/pages.json` - About, Contact, FAQ, policies
- [ ] Build build-time generator: JSON → TypeScript (runs in `vite build`)
- [ ] Maintain backward compatibility during migration

### Phase 2: Admin Dashboard (Web UI)

**Authentication:**
- [ ] Simple password gate (bcrypt, session-based)
- [ ] Route: `/admin` (protected)

**Product Management:**
- [ ] List all products with search/filter
- [ ] Add new product (form with validation)
- [ ] Edit product (inline or modal)
- [ ] Delete product (with confirmation)
- [ ] Image upload (drag & drop, auto-optimize)
- [ ] Stock management (quick + / - controls)
- [ ] Reorder featured products (drag & drop)

**Content Management:**
- [ ] Edit hero banner text
- [ ] Edit About / Contact / FAQ pages
- [ ] Edit shipping & returns policy
- [ ] Manage testimonials

**Deployment Flow:**
- [ ] "Save" creates git commit + opens PR to `main`
- [ ] Shows CI status in UI
- [ ] "Deploy" button merges PR to `prod` (if CI passed)

### Phase 3: ChatGPT MCP Server

**MCP Tools to Implement:**

- `update_product_price(product_id, new_price)` - Updates product price
- `add_product(product_data)` - Creates new product from JSON blob
- `change_banner_text(section, new_text)` - Updates hero/section text
- `list_products(filter)` - Returns products list
- `get_product(product_id)` - Returns single product
- `update_product_description(product_id, new_description)` - Updates description
- `upload_image(image_data, filename)` - Returns image path
- `deploy_changes()` - Creates PR, optionally merges
- `generate_product_description(stone_type, style, materials)` - AI-generated copy

**Example Interaction:**

> "ChatGPT, update the rose quartz pendant to $45 and change its description to mention it pairs well with silver. Also add a new product: citrine earrings, $65, gold-filled wire."

ChatGPT calls MCP tools → commits to GitHub → opens PR → CI runs → Robin merges → site deploys.

---

## 🔒 Security Model

- Admin Dashboard: Password auth (bcrypt), CSRF protection, input validation
- MCP Server: Bearer token auth, rate limiting (100 req/hr), scoped to `data/` directory
- GitHub: Fine-grained PAT with minimal scopes (`repo`, `read:user`)
- Token stored in k3s secret (agenix)

---

## 🚀 Deployment

**Admin Dashboard:**
- Built as part of Vite app
- Route: `/admin/*` (code-split, lazy-loaded)
- No backend—all changes via git

**MCP Server:**
- Deploy to k3s (`ai-inference` namespace)
- Resource: 100m CPU, 128Mi RAM
- Expose internally or via Tailscale funnel

---

## 📅 Rollout Plan

| Week | Phase | Deliverable |
|------|-------|-------------|
| 1-2 | Data Layer | JSON files + build generator |
| 3-4 | Dashboard MVP | Auth + product edit + PR creation |
| 5-6 | Dashboard Full | Add product, images, content editing |
| 7-8 | MCP Server | FastMCP deployment + tools |
| 9-10 | Integration | ChatGPT setup + docs + polish |

---

## 🎯 Acceptance Criteria

**Phase 1:**
- [ ] All products display from `data/products.json`
- [ ] `npm run build` succeeds

**Phase 2:**
- [ ] Robin can login and edit product price
- [ ] Robin can add new product with images
- [ ] Changes create commits + PRs

**Phase 3:**
- [ ] MCP server responds to tool calls
- [ ] ChatGPT can list/update products via MCP
- [ ] ChatGPT can add products via MCP

---

## 📚 Documentation

- [ ] `ADMIN_GUIDE.md` - User manual for Robin
- [ ] `MCP_SETUP.md` - Connect ChatGPT to MCP
- [ ] `DATA_SCHEMA.md` - JSON schema reference
- [ ] `TROUBLESHOOTING.md` - Common issues

---

## 🔗 Related

- Architecture decision: Keep static-site, no database
- Git is source of truth; all changes versioned
- Robin prefers ChatGPT for quick changes, dashboard for bulk edits