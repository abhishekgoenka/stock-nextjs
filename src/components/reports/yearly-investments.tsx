"use client";
import { sumBy } from "lodash";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { getYearlyInvestments, YearlyInvestmentType } from "@/actions/report.service";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStockSyncStore } from "@/store/store";

import NumberFormater from "../shared/number-format";

export default function YearlyInvestment() {
  const [investments, setInvestments] = useState<YearlyInvestmentType[]>([]);
  const exchange = useStockSyncStore(useShallow(store => store.exchange));
  const [totalInvestments, setTotalInvestments] = useState(0);
  useEffect(() => {
    async function fetchData() {
      const yearlyInvestments = await getYearlyInvestments(exchange);
      setInvestments(yearlyInvestments);
      setTotalInvestments(sumBy(yearlyInvestments, "total"));
    }
    fetchData();
  }, [exchange]);

  return (
    <Table className="caption-top">
      <TableCaption>
        <div className="flex justify-between">
          Yearly investments
          <span className="text-right">
            Total : <NumberFormater value={totalInvestments} exchange={exchange} />
          </span>
        </div>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Year</TableHead>
          <TableHead>Stocks</TableHead>
          <TableHead>ETF</TableHead>
          <TableHead className="text-right">Mutual Funds</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {investments.map(investment => (
          <TableRow key={investment.year}>
            <TableCell className="font-bold">{investment.year}</TableCell>
            <TableCell>
              <NumberFormater value={investment.stocks} exchange={exchange} />
            </TableCell>
            <TableCell>
              <NumberFormater value={investment.etf} exchange={exchange} />
            </TableCell>
            <TableCell className="text-right">
              <NumberFormater value={investment.mutualFunds} exchange={exchange} />
            </TableCell>
            <TableCell className="text-right">
              <NumberFormater value={investment.total} exchange={exchange} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  );
}
