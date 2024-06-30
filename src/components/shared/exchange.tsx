"use client";
import { useShallow } from "zustand/react/shallow";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useStockSyncStore } from "@/store/store";

export function Exchange() {
  const { exchange, changeExchange } = useStockSyncStore(
    useShallow(store => ({
      exchange: store.exchange,
      changeExchange: store.changeExchange,
    })),
  );
  return (
    <RadioGroup orientation="horizontal" className="flex" defaultValue={exchange} onValueChange={changeExchange}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="NSE" id="NSE" />
        <Label htmlFor="NSE">NSE</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="NASDAQ" id="NASDAQ" />
        <Label htmlFor="NASDAQ">NASDAQ</Label>
      </div>
    </RadioGroup>
  );
}
