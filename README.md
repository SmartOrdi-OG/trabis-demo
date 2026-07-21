# SmartAc

A business-tracking app for freelancers and small businesses in Austria — income/expense tracking, VAT (UVA) reporting, invoicing, and industry-specific modules (Transport/Fleet, Retail/Inventory), plus a read-only companion portal for accountants.

Live: https://smartac-wine.vercel.app

## What this is

A single-file, no-build, client-side web app. There is no backend and no build step — `index.html` is the entire application (HTML, CSS, and JS in one file), loaded directly by the browser or served as-is by Vercel.

Two HTML files make up the product:

- **`index.html`** — the main app: transactions, invoices, clients/suppliers, employees, calendar/notes, and (depending on the business's selected type) Fleet or Inventory. This is what business owners use.
- **`buchhalter.html`** — a separate, German-only, **read-only** portal for accountants. It reads the same browser's `localStorage`/IndexedDB as `index.html` (see [Data storage](#data-storage)) and never writes to it. This is a temporary, same-device-only solution — a real multi-device "accountant login" requires the Cloud phase (see `TODO.md`).

## Tech stack

- Vanilla JavaScript (ES5-style, no framework, no bundler)
- CSS custom properties for theming (light/dark, RTL support for Arabic)
- [jsPDF](https://github.com/parallax/jsPDF) (bundled inline in `index.html`) for PDF export; [SheetJS](https://sheetjs.com/) via CDN for Excel export
- [Tesseract.js](https://github.com/naptha/tesseract.js) for local, in-browser OCR on receipt photos
- No package manager, no `package.json`, no build pipeline — the app runs by opening the HTML file

## Running locally

There's nothing to install or build. Either:

```bash
# just open it
open index.html

# or serve it (recommended, so relative paths and the PWA manifest work correctly)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Data storage

Everything lives in the browser — there is no server and no database.

- **`localStorage`**, namespaced per user: keys are prefixed `smartac_u_<username>_<key>` (see `uk()` in `index.html`). All reads/writes go through `loadUserData()` and `save()`.
- **IndexedDB**, one database per attachment type: `smartac_receipts` (expense receipts), `smartac_empdocs` (employee documents), `smartac_fleetdocs` (vehicle documents). Created via a shared `makeFileStore(dbName)` factory.
- Account credentials (hashed via `btoa`, **not real encryption** — this is a prototype auth scheme) live under `smartac_accounts`.

**⚠️ IndexedDB gotcha:** `indexedDB.open(name, version)` *creates* the database if it doesn't exist yet, even from a read-only caller. `buchhalter.html` has to open these databases without ever accidentally triggering their `onupgradeneeded` (which would leave an empty, uninitialized store that the main app can then never properly create). If you touch the IndexedDB code in either file, preserve the existence-check-first pattern in `buchhalter.html`'s `idbGet()`/`dbExists()`.

Because everything is `localStorage`/IndexedDB, **data is per-browser, per-device** — there's no sync between devices. That's also why `buchhalter.html` only works from the same browser the business data was entered in.

## Business types (Industry Profiles)

Set once at registration (`state.businessType`, editable later from Settings → Account). Gates which extra modules show up in navigation:

| Type | Unlocks |
|---|---|
| `general` | Base app only |
| `transport` | **Fleet** (vehicles, maintenance log, document expiry alerts, depreciation linked to Assets) |
| `retail` | **Inventory** (products, stock levels, low-stock alerts, quantity auto-adjusts on income/expense) |
| `restaurant`, `construction`, `medical` | Selectable in onboarding, but no dedicated module yet — planned for v2.0 |

## Deployment

Auto-deploys via Vercel on every push to `main`. There's no CI/build step — Vercel just serves the static files.

## Roadmap

See `TODO.md` for the phased plan (current phase, what's done, what's deferred to the Cloud/v2.0 phase, and why).

## Backend handoff

Bringing on a backend developer for the Cloud (v2.0) phase? See [`BACKEND_HANDOFF.md`](BACKEND_HANDOFF.md) — what's already set up (Supabase schema, RLS, Auth, Storage buckets), what's still client-only, and the Supabase-vs-own-server tradeoffs.

## License

Proprietary — Smartordi OG. Not licensed for reuse.
