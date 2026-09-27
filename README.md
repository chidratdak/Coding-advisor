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

That's it — your data is stored locally in `prisma/dev.db` on your own machine. Nothing is sent anywhere else.

## What it does

- **Dashboard** — shows your remaining balance, total income, total expenses, and total saved, broken out separately for each currency you use (amounts in different currencies are never mixed together), plus a chart of what categories your spending goes to.
- **Add Transaction** — log money in (income), money out (expenses), or a contribution toward a savings goal.
- **Savings Goals** — create a goal (e.g. "Emergency Fund — $1,000") and track progress as you contribute to it.

## Stopping the app

Press `Ctrl+C` in the terminal where it's running.
