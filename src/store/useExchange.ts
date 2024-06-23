import { EXCHANGE_TYPE } from "@/lib/constants";
import { create } from "zustand";

type ExchangeState = {
  exchange: EXCHANGE_TYPE;
  // eslint-disable-next-line no-unused-vars
  changeExchange: (newExchange: EXCHANGE_TYPE) => void;
};
export const useExchange = create<ExchangeState>(set => ({
  exchange: "NSE",
  changeExchange: newExchange => set(() => ({ exchange: newExchange })),
}));
