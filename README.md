# Portfolio Insight Dashboard

A responsive web application that tracks a stock portfolio of Indian equities, fetches live market prices from Yahoo Finance, retrieves P/E ratios and earnings from Google Finance, and recalculates portfolio returns dynamically every 15 seconds.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Recharts
- Node.js server routes

## Getting Started

### Prerequisites

Node.js 18.18 or higher (Node 20+ recommended).

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm run start
```

## Portfolio Data

The portfolio contains 26 active stock holdings across 6 sectors (Financial, Tech, Consumer, Power, Pipe, Others) based directly on the provided Excel workbook:

- Total Portfolio Investment: Rs 15,43,060.00
- All purchase prices, quantities, stock names, and exchange codes are preserved exactly from the source data.

## Financial Data Strategy

- **Yahoo Finance**: Used for Current Market Price (CMP), daily changes, and 52-week ranges. Requests are batched into a single query (`yf.quote(symbols)`) on the server and cached in memory for 15 seconds.
- **Google Finance**: Used for P/E ratio and latest earnings per share (EPS). Because Google Finance does not provide a public REST API, data is retrieved via a dedicated server-side scraping module with regex parsing and a 30-minute in-memory cache.
- **No Direct Browser Calls**: All financial data queries go through Next.js server routes (`/api/portfolio`, `/api/market-data`, `/api/portfolio/[symbol]`). Client browser code never calls external APIs directly.

## Auto-Refresh & Performance

- The client polls `/api/market-data` every 15 seconds to fetch updated prices.
- Present Value (`CMP x Quantity`) and Gain/Loss are recalculated on the client to avoid re-fetching static holding metadata.
- Mutex lock guards prevent overlapping refresh requests if a network request takes longer than 15 seconds.
- Missing data fields gracefully fall back to an "Unavailable" state rather than failing the whole table.

## Deployment

The application is built for standard Next.js deployment on Vercel:

1. Push to GitHub.
2. Import repository into Vercel.
3. Deploy using default settings (`next build`).
