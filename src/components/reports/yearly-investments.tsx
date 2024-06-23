"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { MonthlyInvestmentType, YearlyInvestmentType, getMonthlyInvestments, getYearlyInvestments } from "@/actions/report.service";
import { format } from "date-fns";
import NumberFormater from "../shared/number-format";
import { useEffect, useState } from "react";
import { sumBy } from "lodash";
import { useExchange } from "@/store/useExchange";

export default function YearlyInvestment() {
  const [investments, setInvestments] = useState<YearlyInvestmentType[]>([]);
  const exchange = useExchange(store => store.exchange);
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
