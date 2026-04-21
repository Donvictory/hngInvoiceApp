# 🧾 Invoice App

A clean, fast invoice manager I built with React, Tailwind CSS v4, and Firebase. You can create, edit, filter, and delete invoices — all saved to the cloud in real time. It works great in dark mode too.

---

## Table of Contents

- [Getting Started](#getting-started)
- [How It's Built](#how-its-built)
- [Decisions & Trade-offs](#decisions--trade-offs)
- [Accessibility](#accessibility)
- [Extra Touches](#extra-touches)

---

## Getting Started

### What you'll need

- Node.js v18+
- A Firebase project with Firestore enabled ([create one here](https://console.firebase.google.com/))

### 1. Install dependencies

```bash
git clone <your-repo-url>
cd hngInvoiceApp
npm install
```

### 2. Add your Firebase credentials

Create a `.env` file in the root of the project and paste in your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> Don't commit this file — it's already in `.gitignore`.

### 3. Set up Firestore

In your Firebase console, go to **Firestore Database** and create a database (test mode is fine for local development). The app will create the `invoices` collection automatically when you save your first invoice.

### 4. Start it up

```bash
npm run dev
```

Opens at `http://localhost:5173`. That's it.

### Building for production

```bash
npm run build
npm run preview
```

---

## How It's Built

### Stack

| | |
|---|---|
| UI | React 19 |
| Bundler | Vite 8 |
| Styling | Tailwind CSS v4 + plain CSS |
| Database | Firebase Firestore |
| Routing | React Router v7 |
| Icons | Lucide React |
| Animations | Framer Motion |

### Project layout

```
src/
├── components/
│   ├── common/
│   │   ├── Button.jsx       # Handles primary, secondary, ghost, dark, and danger variants
│   │   ├── Input.jsx        # Controlled input with inline error states
│   │   └── Modal.jsx        # Confirmation dialog (used for deletions)
│   ├── invoice/
│   │   ├── InvoiceForm.jsx  # Works as both a slide-out drawer and a full page
│   │   ├── InvoiceItem.jsx  # A single row in the invoice list
│   │   ├── InvoiceList.jsx  # Pulls and renders invoices from Firestore
│   │   ├── InvoicePreview.jsx  # The full invoice detail view
│   │   └── EmptyState.jsx   # What shows when there are no invoices
│   └── layout/
│       ├── DashboardLayout.jsx
│       └── Sidebar.jsx      # Fixed nav with the dark mode toggle
├── lib/
│   └── firebase.js          # SDK setup, reads from .env
├── pages/
│   ├── Dashboard.jsx
│   ├── InvoiceDetail.jsx
│   ├── CreateInvoice.jsx
│   └── EditInvoice.jsx
├── index.css                # Tailwind theme tokens + custom CSS
└── App.jsx                  # Routes
```

### Routing

| URL | What it shows |
|---|---|
| `/` | Invoice list with filter |
| `/invoice/:id` | Invoice detail (read-only) |
| `/create` | Full-page create form |
| `/edit/:id` | Full-page edit form |

### How data flows

All invoice data lives in Firestore. Components fetch what they need directly with `getDocs`. The `InvoiceForm` doubles as a slide-out drawer on the dashboard and a full page on `/create` and `/edit/:id` — the `isPage` prop controls which mode it renders in.

---

## Decisions & Trade-offs

### Using `getDocs` instead of `onSnapshot`

I went with one-time fetches rather than real-time listeners. For a single-user app this is simpler and avoids dealing with subscription cleanup. The downside is you won't see changes from another tab without refreshing — something I'd swap for `onSnapshot` if this went multi-user.

### No global state (no Redux, no Zustand)

The app is small enough that local `useState` and direct Firestore calls work cleanly. Adding a store felt like overkill at this scale. If the app grows, a React context or Zustand store would be the natural next step.

### `window.location.reload()` after saving

Not elegant, but reliable. It ensures the list always reflects the latest data without building a cache-invalidation system. A proper solution would be to refetch just the affected query, or use `onSnapshot`.

### Tailwind v4 + plain CSS for hover effects

Tailwind v4 purges classes it can't statically detect. The hover border on invoice cards was getting stripped because it was built with dynamic class strings. Moving it to a plain `.invoice-item` CSS class in `index.css` fixes the issue permanently — CSS rules are never purged.

### Flat Firestore collection

Everything goes into a single `invoices` collection. Simple and fast to work with. If this needed to support multiple users, I'd add a `userId` field and scope the queries (and security rules) per user.

---

## Accessibility

- All form elements use proper `<label>`, `<input>`, `<select>`, and `<button>` tags — nothing is faking interactivity with divs.
- The heading hierarchy is correct on every page (`h1` → `h2` → `h3`).
- Every interactive element is keyboard-reachable. The filter dropdown closes gracefully on outside click.
- Required fields highlight in red with an inline "can't be empty" message when you try to submit without filling them in — errors aren't just colour-coded, they also have text.
- Status badges (Paid / Pending / Draft) have enough contrast in both light and dark mode.
- Animations use only `opacity` and `transform` — no layout shifts, nothing disorienting.

---

## Extra Touches

**Dark mode** — Full dark/light toggle that persists across sessions via `localStorage`. Every component supports it.

**Responsive layout** — The sidebar collapses into a top bar on mobile. Invoice list items reflow from a wide table layout to a compact card layout on small screens. The form grid also adapts.

**Slide-out drawer** — Creating an invoice from the dashboard opens a smooth slide-in panel so you never lose your place in the list.

**Status filter** — Filter by All, Paid, Pending, or Draft. The header updates in real time to say things like *"There are 3 pending invoices"*.

**Draft support** — You can save an invoice as a Draft (skips validation) or Pending (requires all fields). Drafts look visually distinct in the list.

**Secure config** — Firebase credentials live in `.env` and are never hardcoded, so the repo is safe to make public.

**Micro-interactions** — The sidebar logo has a hover fill animation. The chevron on list items slides right on hover. The filter arrow rotates when the dropdown opens. Small things that make the UI feel alive.

**Deletion confirmation** — Deleting an invoice shows a proper confirmation modal instead of a browser `confirm()` dialog. Accidental deletions are a lot less likely.

**Form validation with a notice** — When you try to submit with missing fields or invalid item prices, a clear notice appears at the bottom of the form listing exactly what's wrong. The notice disappears once you fix the issues and try again.
