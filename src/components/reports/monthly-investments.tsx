"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { MonthlyInvestmentType, getMonthlyInvestments } from "@/actions/report.service";
import { format } from "date-fns";
import NumberFormater from "../shared/number-format";
import { useEffect, useState } from "react";
import { useExchange } from "@/store/useExchange";

export default function MonthlyInvestment() {
  const [investments, setInvestments] = useState<MonthlyInvestmentType[]>([]);
  const exchange = useExchange(store => store.exchange);
  useEffect(() => {
    async function fetchData() {
      const monthlyInvestments = await getMonthlyInvestments(exchange);
      setInvestments(monthlyInvestments);
    }
    fetchData();
  }, [exchange]);

  return (
    <Table className="caption-top">
      <TableCaption className="text-center">
        Monthly investments <Badge> last 10 months</Badge>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Month</TableHead>
          <TableHead>Stocks</TableHead>
          <TableHead>ETF</TableHead>
          <TableHead className="text-right">Mutual Funds</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {investments.map(investment => (
          <TableRow key={investment.month.toString()}>
            <TableCell className="font-medium">{format(investment.month, "MMM-yyyy")}</TableCell>
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
