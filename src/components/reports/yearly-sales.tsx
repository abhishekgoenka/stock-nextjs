"use client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TotalSaleByYear, getTotalSales } from "@/actions/report.service";
import NumberFormater from "../shared/number-format";
import { useEffect, useState } from "react";
import { useExchange } from "@/store/useExchange";

export default function YearlySales() {
  const [sales, setSales] = useState<TotalSaleByYear | null>(null);
  const exchange = useExchange(store => store.exchange);
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.sales?.map(r => (
          <TableRow key={r.year}>
            <TableCell className="font-bold">{r.year}</TableCell>
            <TableCell className="text-right">
              <NumberFormater value={r.sales} exchange={exchange} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
