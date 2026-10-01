# Technical Challenges and Solutions

This document outlines the real challenges faced during the development of the portfolio dashboard and how each was resolved.

---

### 1. Unofficial Market Data Sources

**Problem:**
Neither Yahoo Finance nor Google Finance provides an official, free public REST API for developers to query Indian equities, P/E ratios, and earnings data.

**Solution:**
Handled all data retrieval exclusively on the server side. Used a server-side client library to batch-fetch live market quotes from Yahoo Finance, and built a server scraper to retrieve valuation metrics from Google Finance pages. All external calls stay on the server to prevent browser cross-origin blocks and keep external communication secure.

---

### 2. Discrepancies in Stock Identifiers

**Problem:**
Two stocks in the provided portfolio failed to return data when queried with standard symbols:
- Savani Financials returned no price data.
- LTI Mindtree failed to return quote information under its common NSE ticker.

**Solution:**
Researched the exchange listings and discovered that Savani Financials had rebranded to Mantra Capital on the Bombay Stock Exchange, while LTI Mindtree trades under a slightly different ticker symbol on Yahoo Finance. Built a centralized symbol mapping table that links the original portfolio names to the exact query symbols expected by each data provider.

---

### 3. Rate Limiting on Rapid Refreshes

**Problem:**
Querying 26 stocks individually every 15 seconds would produce hundreds of external HTTP requests per minute, quickly triggering rate limits and IP blocking.

**Solution:**
Combined all 26 quote requests into a single batch network call for Yahoo Finance. For Google Finance, fundamental metrics like P/E and earnings change infrequently, so these are cached in server memory for 30 minutes. This reduced external requests by more than 90% while keeping live prices fresh.

---

### 4. Overlapping Refresh Requests on Slow Connections

**Problem:**
If a network request took longer than 15 seconds, the periodic timer would fire another request before the previous one finished, causing race conditions, out-of-order responses, and UI flickering.

**Solution:**
Implemented an active request lock on the client. When a background refresh starts, new refresh triggers are blocked until the current request completes. If an update takes longer than 15 seconds, the timer waits for the current request to finish before scheduling the next cycle.

---

### 5. Missing or Incomplete Valuation Metrics

**Problem:**
Loss-making companies do not report a price-to-earnings ratio, and occasional network timeouts can lead to missing data fields for individual stocks.

**Solution:**
Designed the data pipeline to handle missing values gracefully. If a specific metric fails or is not reported by the exchange, the dashboard shows a clean "Unavailable" label for that specific cell while all remaining calculations, totals, and rows continue to work normally.

---

### 6. Displaying Detailed Tables on Mobile Devices

**Problem:**
The portfolio table requires 11 data columns per stock. Fitting all columns on a mobile phone screen causes severe text clipping and horizontal cramping.

**Solution:**
Made the table horizontally scrollable on mobile devices with clean typography, and added an interactive modal that opens when a user taps any stock row, presenting the complete breakdown of prices, quantities, returns, and fundamentals in a clean vertical layout.
