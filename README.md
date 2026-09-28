# Money Tracker

A simple web app to record your daily income, expenses, and savings goals, and see a dashboard of where your money stands — in USD, THB, CNY, and LAK. Anyone you share it with creates their own account and only ever sees their own data.

## Put it online (recommended — works anywhere, no WiFi restriction)

This makes the app live at its own web address, so you and your friends can each log in from anywhere — no need for your computer to be on or everyone on the same WiFi.

**1. Create a free database (2 minutes)**
- Go to [neon.tech](https://neon.tech) and sign up (free).
- Create a new project. It'll show you a **connection string** that looks like
  `postgresql://user:password@host/dbname?sslmode=require` — copy it, you'll need it in step 3.

**2. Create a free Vercel account and import this project**
- Go to [vercel.com](https://vercel.com) and sign up using your **GitHub** account (the same one this code lives in).
- Click **Add New → Project**, and pick this repository (`Coding-advisor`).
- When it asks which branch, choose `claude/finance-dashboard-webapp-jltl70` (or whichever branch has the latest version).

**3. Add two settings before deploying**
Still on Vercel, find **Environment Variables** and add:
| Name | Value |
|---|---|
| `DATABASE_URL` | the connection string you copied from Neon in step 1 |
| `SESSION_SECRET` | any long random string — mash your keyboard for 40+ characters |

**4. Click Deploy**
Vercel builds the app and sets up the database tables automatically. After a minute or two, it gives you a real web address like `https://your-app-name.vercel.app`.

**5. Share that address**
Open it, create your own username + 4-digit PIN, and send the same link to your friends — each of them creates their own separate account (nobody sees anyone else's numbers).

**6. Add it to your phone's home screen**
Open the address on your phone, then:
- **iPhone (Safari):** tap the Share icon → "Add to Home Screen"
- **Android (Chrome):** tap the menu (⋮) → "Add to Home screen" or "Install app"

It'll get its own icon and open full-screen, without browser bars — just like a real app.

Any time this code changes, push it to that branch and Vercel redeploys automatically.

## Running it on your own computer instead

Only needed if you want to run it locally instead of (or before) putting it online.

You need [Node.js](https://nodejs.org) and a Postgres database — the same free Neon database from step 1 above works fine for this too.

1. Open a terminal in this folder.
2. Create a `.env.local` file in this folder with one line:
   ```
   DATABASE_URL="paste-your-neon-connection-string-here"
   ```
3. Install dependencies (one-time):
   ```
   npm install
   ```
4. Start the app:
   ```
   npm run dev
   ```
5. Open your browser to **http://localhost:3000**

## Using the locally-running version on your phone (same WiFi only)

1. Make sure your phone and computer are on the **same WiFi network**.
2. With `npm run dev` running, look at the terminal — it prints a line like:
   ```
   - Network:      http://192.168.1.23:3000
   ```
3. Open that exact address on your phone's browser (the numbers will differ on your network).

This only works while your computer is on and both devices share the same WiFi — the "Put it online" option above doesn't have this limitation.

## What it does

- **Login** — each person creates their own username + 4-digit PIN. This is a convenience lock, not bank-grade security — see the note on the sign-up screen.
- **Dashboard** — shows your remaining balance, total income, total expenses, and total saved, broken out separately for each currency you use (amounts in different currencies are never mixed together), plus a chart of what categories your spending goes to.
- **Add Transaction** — log money in (income), money out (expenses), or a contribution toward a savings goal. Expense categories: Food, Drinks, Beauty & Self-Care, Groceries, Personal Items, Education, Utilities, Transport, Family, Others.
- **Savings Goals** — create a goal (e.g. "Emergency Fund — $1,000") with a category (Stocks, Gold, Emergency Fund) and track progress as you contribute to it.

## If you ever forget your PIN

There's no automatic password reset yet. Ask whoever manages the database (Neon) to delete your row from the `User` table, then sign up again — this loses that account's transaction history.
