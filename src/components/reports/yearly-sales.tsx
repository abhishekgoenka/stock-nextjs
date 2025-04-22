"use client";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { getTotalSales, TotalSaleByYear } from "@/actions/report.service";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStockSyncStore } from "@/store/store";

import NumberFormater from "../shared/number-format";

export default function YearlySales() {
  const [sales, setSales] = useState<TotalSaleByYear | null>(null);
  const exchange = useStockSyncStore(useShallow(store => store.exchange));
  useEffect(() => {
    async function fetchData() {
      const data = await getTotalSales(exchange);
      setSales(data);
    }
    fetchData();
  }, [exchange]);

  if (!exchange || !sales) {
    return <div>not found!!!</div>;
  }

  return (
    <Table className="caption-top">
      <TableCaption>
        <div className="flex justify-between">
          Stock sold
          <span className="text-right">
            Total : <NumberFormater value={sales?.total} exchange={exchange} />
          </span>
        </div>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Year</TableHead>
          <TableHead className="text-right">Sales</TableHead>
          <TableHead className="text-right">P/L</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.sales?.map(r => (
          <TableRow key={r.year}>
            <TableCell className="font-bold">{r.year}</TableCell>
            <TableCell className="text-right">
              <NumberFormater value={r.sales} exchange={exchange} data-testid={`salesSold${r.year}`} />
            </TableCell>
            <TableCell className="text-right">
              <NumberFormater value={r.profitLoss} exchange={exchange} data-testid={`salesProfitLoss${r.year}`} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
