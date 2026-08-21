# Troves & Coves — Client Handoff Guide

Welcome! This guide explains how to look after the Troves & Coves website with help from GitHub and [Freebuff](https://freebuff.com/). You do **not** need to learn React or TypeScript to request most changes.

> **Important:** The website currently publishes from the `prod` branch to GitHub Pages at [trovesandcoves.ca](https://trovesandcoves.ca). Freebuff can provide a workspace and live preview for the GitHub repository, but the production hosting and deployment path should not be changed until it has been tested and explicitly agreed upon.

---

## 1. Accounts and access

You will need:

- A GitHub account added as a collaborator on the repository: `reverb256/trovesandcoves`
- A Freebuff account at [freebuff.com](https://freebuff.com/)
- Access to the Etsy shop: [TrovesAndCoves](https://www.etsy.com/ca/shop/TrovesandCoves)
- Access to the domain/DNS account only if you will manage the custom domain yourself

### Recommended ownership arrangement

- **GitHub repository:** You are a collaborator; the developer remains available to review changes.
- **Freebuff workspace:** You use your own Freebuff account. Do not share passwords.
- **Etsy shop and domain:** Keep these under the business owner's account.
- **Secrets and infrastructure:** Never paste passwords, API keys, tokens, or private credentials into Freebuff prompts, issues, or source files.

Freebuff's public documentation confirms GitHub repository connections and shareable previews. Its public documentation does not currently describe a separate, granular collaborator/role-management system, so GitHub permissions remain the source of truth for repository access.

### Using the developer's referral

Use the developer's referral link when creating your Freebuff account. Ask the developer for the exact referral URL before signing up:

> **Referral link:** Obtain this directly from the developer before account creation.

Do not guess or substitute a normal homepage URL if referral attribution matters. The referral link should be provided separately through a trusted private channel, not committed to this repository.

---

## 2. First-time setup

### Step A — Accept the GitHub invitation

1. Watch for an invitation from GitHub to join `reverb256/trovesandcoves`.
2. Accept it while signed into the GitHub account you plan to use.
3. Open the repository and confirm you can see the code and the **Actions** tab.
4. Do not change branch protection, workflow permissions, secrets, or DNS without checking with the developer first.

### Step B — Create your Freebuff workspace

1. Open [freebuff.com](https://freebuff.com/) and sign in with GitHub if offered.
2. Use the developer's referral link above before completing signup.
3. Connect or select the `reverb256/trovesandcoves` repository.
4. Let Freebuff boot the project and create a preview.
5. Treat the Freebuff preview URL as a review environment unless the production hosting arrangement has been deliberately migrated.

If Freebuff cannot see the repository, the GitHub invitation may not have been accepted by the same account, or the repository authorization may need to be refreshed.

---

## 3. The safest way to request a change

Start with a small, specific request. For example:

> “On the About page, update the studio description to say that we now offer local pickup in Winnipeg. Keep the current tone and do not change the layout.”

Good requests include:

- The page or product to change
- The exact new wording, if you know it
- What must stay unchanged
- Whether the change is urgent

Before accepting a change:

1. Ask Freebuff to explain which files it plans to modify.
2. Review the preview on desktop and mobile widths.
3. Check navigation, images, the theme toggle, and the cart.
4. Ask for a concise summary of the change.
5. Have the developer review or approve production changes when practical.

### Useful prompts

```text
Please inspect the repository first. Do not edit anything yet. Tell me which files control the About page copy and propose the smallest safe change.
```

```text
Update only the product description for [product name]. Preserve the existing image, price, Etsy link, styling, and layout. Show me the proposed diff before applying it.
```

```text
Review this change for broken links, accessibility issues, mobile layout problems, and accidental hardcoded colors. Do not make additional changes unless I approve them.
```

```text
Run the project's type check and lint checks, then tell me whether the change is safe to deploy. Do not push to production.
```

---

## 4. Product updates

The public site currently bundles its production catalog into:

- `shared/embedded-data.ts` — the primary embedded catalog used by the static site
- `server/authentic-products.ts` — server-side catalog data
- `etsy-products.json` — imported Etsy data used by project tooling

For a routine product update, the safest process is:

1. Update the corresponding Etsy listing first: title, photos, description, price, and availability.
2. Ask the developer whether the website's embedded catalog should also be updated.
3. Preview the change before publishing.
4. Confirm that the Etsy checkout link still opens the correct listing.

Do not assume that changing Etsy automatically changes the static GitHub Pages site. This repository contains Etsy synchronization tooling and a Cloudflare sync worker, but the production frontend also has embedded static data. The developer should confirm which sync/deployment path is active before relying on automation.

### Product checklist

- [ ] Name and description are accurate
- [ ] Price is in CAD and correct
- [ ] Product is in stock or clearly marked unavailable
- [ ] Photos are sharp, well-cropped, and have useful alt text
- [ ] Gemstones/materials are accurate
- [ ] Etsy listing URL opens correctly
- [ ] Product appears correctly in the Freebuff preview

---

## 5. Publishing and production safety

The current production workflow is:

1. A change is made and reviewed in Freebuff/GitHub.
2. The developer moves the approved change through the repository's protected branch workflow.
3. A push to `prod` triggers GitHub Actions.
4. GitHub Actions runs type checking, linting, the production build, and prerendering.
5. The build is deployed to GitHub Pages at [trovesandcoves.ca](https://trovesandcoves.ca).

You do not need to manage branches or cherry-pick commits unless the developer specifically asks you to. The `prod` branch is protected; do not force-push, rewrite history, or merge directly into it without the developer's guidance.

### Before publishing

- [ ] Preview reviewed on desktop and mobile
- [ ] `npm run check` passes
- [ ] `npm run lint` passes
- [ ] Relevant tests pass
- [ ] No secrets were added to the repository
- [ ] Etsy links and product details were checked
- [ ] Developer approval received for production-impacting changes

### If a deployment fails

1. Do not repeatedly re-run a failing workflow without reading the error.
2. Open the failed GitHub Actions run and copy the relevant error message.
3. Check whether the failure is type checking, linting, build/prerendering, or deployment.
4. Send the error and the commit link to the developer.
5. If the site is live but appears stale, the developer can investigate cache invalidation.

---

## 6. Local development (optional)

Most content changes can be reviewed through Freebuff. If you work locally:

```bash
npm install
npm run dev
```

The development server normally runs at `http://localhost:5000` for this repository.

Useful checks:

```bash
npm run check
npm run lint
npm run test
npm run build
```

Do not commit `.env` files, credentials, local databases, or `.freebuff/` runtime artifacts unless the developer specifically says they are intended to be tracked.

---

## 7. What Freebuff is and is not

Freebuff is useful for:

- Asking questions about the codebase in plain language
- Making small, reviewable changes with AI assistance
- Booting a project workspace and live preview
- Sharing a preview for feedback

Freebuff is not a substitute for:

- GitHub repository permissions
- Etsy ownership or listing management
- Domain/DNS ownership
- Reviewing production deployments
- Keeping secrets secure

If a Freebuff screen offers deployment or a custom domain, pause and confirm the target first. The current canonical production site is GitHub Pages with the custom domain `trovesandcoves.ca`.

---

## 8. Support and escalation

Contact the developer when you need to:

- Add or remove a collaborator
- Change GitHub Actions or branch protection
- Change the domain, DNS, Cloudflare, or Etsy sync configuration
- Add a new page or substantial feature
- Fix a failed production deployment
- Change checkout, analytics, API, or security behavior

When asking for help, include:

- What you were trying to do
- The page or product involved
- The preview or production URL
- The exact error message
- The GitHub commit or Actions run link, if available

---

## Quick links

- [Live website](https://trovesandcoves.ca)
- [Etsy shop](https://www.etsy.com/ca/shop/TrovesandCoves)
- [GitHub repository](https://github.com/reverb256/trovesandcoves)
- [Freebuff](https://freebuff.com/)
- [Project README](README.md)
- [Developer knowledge reference](knowledge.md)
