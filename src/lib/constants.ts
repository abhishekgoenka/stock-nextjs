import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

export const BROKERS = [
  { label: "WEBULL", value: "WEBULL", icon: QuestionMarkCircledIcon },
  { label: "GROWW", value: "GROWW", icon: QuestionMarkCircledIcon },
  { label: "DHANN", value: "DHANN", icon: QuestionMarkCircledIcon },
  { label: "UPSTOX", value: "UPSTOX", icon: QuestionMarkCircledIcon },
  { label: "ZERODHA", value: "ZERODHA", icon: QuestionMarkCircledIcon },
  {
    label: "Traditional",
    value: "FidilityTraditional",
    icon: QuestionMarkCircledIcon,
  },
  {
    label: "Individual",
    value: "FidilityIndividual",
    icon: QuestionMarkCircledIcon,
  },
  {
    label: "Roth",
    value: "FidilityRoth",
    icon: QuestionMarkCircledIcon,
  },
];

export const CURRENCY = [
  { label: "INR", value: "INR" },
  { label: "USD", value: "USD" },
];

export type EXCHANGE_TYPE = "NSE" | "NASDAQ";
export const EXCHANGE = [
  { label: "NSE", value: "NSE" },
  { label: "NASDAQ", value: "NASDAQ" },
];

export const DEPOSIT_DIVIDEND_RECEIVED = "Divident Received";
export type DEPOSIT = "Fund Transfer" | "Dividend";
export const DEPOSIT_TYPE = [
  {
    value: "Fund Transfered",
    label: "Transfered",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "Fund Refund",
    label: "Refund",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "Divident Received",
    label: "Dividend",
    icon: QuestionMarkCircledIcon,
  },
];

export type StockOrMutualFundType = "stock" | "mf";
