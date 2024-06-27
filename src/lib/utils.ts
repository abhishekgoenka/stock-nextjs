import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { EXCHANGE_TYPE } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToExchangeType(s: string): EXCHANGE_TYPE {
  if (s.toLocaleLowerCase() === "nse") return "NSE";
  return "NASDAQ";
}
