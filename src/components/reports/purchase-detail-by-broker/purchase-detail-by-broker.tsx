"use client";

import { PurchaseDetailByBrokerType, getPurchaseDetailByBroker } from "@/actions/purchase-detail.service";
import NumberFormater, { CustomNumericFormat } from "@/components/shared/number-format";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";

type StockPurchaseDetailByBrokerProps = {
  broker: string;
};

export default function PurchaseDetailByBroker({ broker }: StockPurchaseDetailByBrokerProps) {
  const [data, setData] = useState<PurchaseDetailByBrokerType | null>(null);
  useEffect(() => {
    async function fetchData() {
      const returns = await getPurchaseDetailByBroker(broker);
      setData(returns);
    }
    fetchData();
  }, [broker]);

  if (!data) {
    return <div>Not found!!!</div>;
  }

  const currency = data?.data[0]?.currency;
  return (
    <>
      <Table className="caption-top">
        <TableCaption>
          <h1 className="my-4 text-xl">Purchase detail by broker</h1>
          <div className="flex justify-between">
            <div>Broker : {data.broker}</div>
            <div>
              Invested : <NumberFormater className="text-black" value={data.investedValue} currency={currency} />
            </div>
            <div>
              Profit/Loss : <NumberFormater className="text-black" value={data.totalProfit} currency={currency} />
            </div>
          </div>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Name</TableHead>
            <TableHead className="text-center">Date</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Current Price</TableHead>
            <TableHead className="text-right">XIRR</TableHead>
            <TableHead className="text-right">CAGR</TableHead>
            <TableHead className="text-right">Profit/Loss</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data.map(r => (
            <TableRow key={`${r.id}-${r.name}`}>
              <TableCell className="font-bold">{r.name}</TableCell>
              <TableCell>{format(r.purchaseDate, "PPP")}</TableCell>
              <TableCell className="text-right">{r.qty}</TableCell>
              <TableCell className="text-right">
                <NumberFormater value={r.price} currency={r.currency} />
              </TableCell>
              <TableCell className="text-right">
                <NumberFormater value={r.currentPrice} currency={r.currency} />
              </TableCell>
              <TableCell className="text-right">
                <CustomNumericFormat value={r.XIRR} />
              </TableCell>
              <TableCell className="text-right">
                <CustomNumericFormat value={r.CAGR} />
              </TableCell>
              <TableCell
                className={cn("text-right", { "text-primary": r.currentAmount - r.netAmount > 0 }, { "text-destructive": r.currentAmount - r.netAmount < 0 })}
              >
                <NumberFormater value={r.currentAmount - r.netAmount} currency={r.currency} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
