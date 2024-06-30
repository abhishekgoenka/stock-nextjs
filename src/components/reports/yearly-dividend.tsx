"use client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { YearlyDividendType, getYearlyDividend } from "@/actions/report.service";
import NumberFormater from "../shared/number-format";
import { useEffect, useState } from "react";
import { sumBy } from "lodash";
import { useShallow } from "zustand/react/shallow";
import { useStockSyncStore } from "@/store/store";

export default function YearlyDividend() {
  const [dividend, setDividend] = useState<YearlyDividendType[]>([]);
  const [total, setTotal] = useState(0);
  const exchange = useStockSyncStore(useShallow(store => store.exchange));
  useEffect(() => {
    async function fetchData() {
      const dividends = await getYearlyDividend(exchange);
      setDividend(dividends);
      setTotal(sumBy(dividends, "amount"));
    }
    fetchData();
  }, [exchange]);

  if (!exchange) {
    return <div>not found!!!</div>;
  }

  return (
    <Table className="caption-top">
      <TableCaption>
        <div className="flex justify-between">
          Dividend
          <span className="text-right">
            Total : <NumberFormater value={total} exchange={exchange} />
          </span>
        </div>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Year</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dividend?.map(r => (
          <TableRow key={r.year}>
            <TableCell className="font-bold">{r.year}</TableCell>
            <TableCell className="text-right">
              <NumberFormater value={r.amount} exchange={exchange} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
