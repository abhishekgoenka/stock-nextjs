import { EXCHANGE_TYPE } from "@/lib/constants";
import { StateCreator, create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// const customMiddlewares = f => devtools(persist(immer(f), { name: "stockSync" }));

type ExchangeState = {
  exchange: EXCHANGE_TYPE;
  // eslint-disable-next-line no-unused-vars
  changeExchange: (newExchange: EXCHANGE_TYPE) => void;
};

// const useBearStore = create<ExchangeState>()(
//   customMiddlewares(set => ({
//     exchange: "NSE",
//     changeExchange: newExchange => set(() => ({ exchange: newExchange })),
//   })),
// );

export const createExchange: StateCreator<ExchangeState, [["zustand/immer", never]], [], ExchangeState> = set => ({
  exchange: "NSE",
  changeExchange: newExchange =>
    set(store => {
      store.exchange = newExchange;
    }),
});

export const useStockSyncStore = create<ExchangeState>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createExchange(...a),
      })),
      { name: "stockSync" },
    ),
  ),
);
