"use client";
import { useExchange } from "@/store/useExchange";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export function Exchange() {
  const { exchange, changeExchange } = useExchange();
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
