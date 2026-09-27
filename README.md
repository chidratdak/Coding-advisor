# Money Tracker

A simple web app to record your daily income, expenses, and savings goals, and see a dashboard of where your money stands — in USD, THB, CNY, and LAK.

## Running it on your own computer

You need [Node.js](https://nodejs.org) installed (version 18 or newer).

1. Open a terminal in this folder.
2. Install the app's dependencies (one-time):
   ```
   npm install
   ```
3. Set up the local database (one-time):
   ```
   npx prisma db push
   ```
4. Start the app:
   ```
   npm run dev
   ```
5. Open your browser to **http://localhost:3000**

The first time you open it, you'll be asked to create a username and a 4-digit PIN — that's your login for this app on this computer. (This is a convenience lock, not bank-grade security — see the note on the setup screen.)

That's it — your data is stored locally in `prisma/dev.db` on your own machine. Nothing is sent anywhere else.

## Using it on your phone (same WiFi)

1. Make sure your phone and computer are on the **same WiFi network**.
2. With `npm run dev` running, look at the terminal — it prints a line like:
   ```
   - Network:      http://192.168.1.23:3000
   ```
3. On your phone's browser, open that exact address (the numbers will be different on your network).
4. Log in with the username/PIN you set up.
5. To make it feel like a real app: in your phone's browser menu, choose **"Add to Home Screen"** (iPhone/Safari) or **"Install app"** (Android/Chrome). It'll get its own icon and open full-screen, without browser bars.

This only works while your computer is on, `npm run dev` is running, and both devices share the same WiFi.

## What it does

- **Login** — a username + 4-digit PIN lock screen, set up the first time you open the app.
- **Dashboard** — shows your remaining balance, total income, total expenses, and total saved, broken out separately for each currency you use (amounts in different currencies are never mixed together), plus a chart of what categories your spending goes to.
- **Add Transaction** — log money in (income), money out (expenses), or a contribution toward a savings goal. Expense categories: Food, Drinks, Beauty & Self-Care, Groceries, Personal Items, Education, Utilities, Transport, Family, Others.
- **Savings Goals** — create a goal (e.g. "Emergency Fund — $1,000") with a category (Stocks, Gold, Emergency Fund) and track progress as you contribute to it.

## Stopping the app

Press `Ctrl+C` in the terminal where it's running.

## If you ever forget your PIN

Stop the app, delete the `prisma/dev.db` file, then run `npx prisma db push` again and restart — this resets everything (including your transaction history), and you'll be asked to set up a fresh username/PIN.
