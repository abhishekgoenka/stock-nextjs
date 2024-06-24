"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "../ui/badge";
import {
  ExpectedReturnType,
  MonthlyInvestmentType,
  YearlyInvestmentType,
  expectedReturn,
  getMonthlyInvestments,
  getYearlyInvestments,
} from "@/actions/report.service";
import { format } from "date-fns";
import NumberFormater from "../shared/number-format";
import { useEffect, useState } from "react";
import { sumBy } from "lodash";
import { useExchange } from "@/store/useExchange";

export default function InvestmentReturn() {
  const [expected, setExpected] = useState<ExpectedReturnType | null>(null);
  const exchange = useExchange(store => store.exchange);
  // const [expectedReturn, setTotalInvestments] = useState(0);
  useEffect(() => {
    async function fetchData() {
      const returns = await expectedReturn(exchange);
      setExpected(returns);
      // setTotalInvestments(sumBy(returns, "total"));
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
          Investment Returns
          <span className="text-right">
            Networth : <NumberFormater value={expected?.netWorth!} exchange={exchange} />
          </span>
        </div>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold"></TableHead>
          <TableHead className="text-right">12%</TableHead>
          <TableHead className="text-right">15%</TableHead>
          <TableHead className="text-right">Actual</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expected?.returns.map(r => (
          <TableRow key={r.broker}>
            <TableCell className="font-bold">{r.broker}</TableCell>
            <TableCell className="text-right">
              <NumberFormater value={r.percentage12} exchange={exchange} />
            </TableCell>
            <TableCell className="text-right">
              <NumberFormater value={r.percentage15} exchange={exchange} />
            </TableCell>
            <TableCell className="text-right">
              <NumberFormater value={r.actual} exchange={exchange} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="font-bold">Total</TableCell>
          <TableCell className="text-right font-bold">
            <NumberFormater value={expected?.total.percentage12!} exchange={exchange} />
          </TableCell>
          <TableCell className="text-right font-bold">
            <NumberFormater value={expected?.total.percentage15!} exchange={exchange} />
          </TableCell>
          <TableCell className="text-right font-bold">
            <NumberFormater value={expected?.total.actual!} exchange={exchange} />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
