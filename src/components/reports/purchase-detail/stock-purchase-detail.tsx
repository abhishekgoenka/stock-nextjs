"use client";

import { PurchaseDetailType, getPurchaseDetail } from "@/actions/purchase-detail.service";
import NumberFormater from "@/components/shared/number-format";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useExchange } from "@/store/useExchange";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";

export default function StockPurchaseDetail() {
  const [data, setData] = useState<PurchaseDetailType | null>(null);
  // const exchange = useExchange(store => store.exchange);
  useEffect(() => {
    async function fetchData() {
      const returns = await getPurchaseDetail("stock", 46);
      setData(returns);
    }
    fetchData();
  }, []);

  if (!data) {
    return <div>not found!!!</div>;
  }
  return (
    <Table className="caption-top">
      <TableCaption>
        <div className="flex justify-between">
          Investment by broker
          <div className="text-right align-top flex gap-2">
            {/* <Switch checked={includeBrokerage} onCheckedChange={() => setIncludeBrokerage(b => !b)} /> */}
            Include brokerage and other charges
          </div>
        </div>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Name</TableHead>
          <TableHead className="">Date</TableHead>
          <TableHead className="text-right">Qty </TableHead>
          <TableHead className="text-right">Price </TableHead>
          <TableHead>Broker</TableHead>
          <TableHead className="text-right">XIRR</TableHead>
          <TableHead className="text-right">CAGR</TableHead>
          <TableHead className="text-right">Profit/Loss</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.data.map(r => (
          <TableRow key={r.id}>
            <TableCell className="font-bold">{r.name}</TableCell>
            <TableCell>{format(r.purchaseDate, "PPP")}</TableCell>
            <TableCell className="text-right">{r.qty}</TableCell>
            <TableCell className="text-right">
              <NumberFormater value={r.price} currency={r.currency} />
            </TableCell>
            <TableCell>{r.broker}</TableCell>
            <TableCell className="text-right">
              <NumericFormat displayType="text" decimalScale={2} value={r.XIRR} />
            </TableCell>
            <TableCell className="text-right">
              <NumericFormat displayType="text" decimalScale={2} value={r.CAGR} />
            </TableCell>
            <TableCell className="text-right text-primary">
              <NumberFormater value={r.currentAmount - r.netAmount} currency={r.currency} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
