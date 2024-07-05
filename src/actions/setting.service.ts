"use server";

import { NseIndia } from "stock-nse-india";
import { EquityDetails } from "stock-nse-india/build/interface";
import yahooFinance from "yahoo-finance2";

export async function getUSAStockPrice(symbol: string): Promise<number | undefined> {
  const quote = await yahooFinance.quoteSummary(symbol);
  return quote?.price?.regularMarketPrice;
}

export async function syncStockPrice(symbol: string): Promise<EquityDetails> {
  const nseIndia = new NseIndia();
  return await nseIndia.getEquityDetails(symbol);
}
