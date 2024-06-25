"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "../ui/badge";
import {
  ExpectedReturnType,
  InvestmentByBrokerType,
  MonthlyInvestmentType,
  YearlyInvestmentType,
  expectedReturn,
  getInvestmentByBroker,
  getMonthlyInvestments,
  getYearlyInvestments,
} from "@/actions/report.service";
import { format } from "date-fns";
import NumberFormater from "../shared/number-format";
import { useEffect, useState } from "react";
import { sumBy } from "lodash";
import { useExchange } from "@/store/useExchange";
import { Switch } from "../ui/switch";

export default function InvestmentByBroker() {
  const [data, setData] = useState<InvestmentByBrokerType | null>(null);
  const [includeBrokerage, setIncludeBrokerage] = useState(false);
  const exchange = useExchange(store => store.exchange);
  useEffect(() => {
    async function fetchData() {
      const returns = await getInvestmentByBroker(exchange, includeBrokerage);
      setData(returns);
    }
    fetchData();
  }, [exchange, includeBrokerage]);

  if (!exchange || !data) {
    return <div>not found!!!</div>;
  }

  return (
    <Table className="caption-top">
      <TableCaption>
        <div className="flex justify-between">
          Investment by broker
          <div className="text-right align-top flex gap-2">
            <Switch checked={includeBrokerage} onCheckedChange={() => setIncludeBrokerage(b => !b)} />
            Include brokerage and other charges
          </div>
        </div>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Broker</TableHead>
          <TableHead className="text-right">Stocks </TableHead>
          <TableHead className="text-right">ETF </TableHead>
          <TableHead className="text-right">Mutual Funds </TableHead>
          <TableHead className="text-right">Total </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.brokers.map(r => (
          <TableRow key={r.broker}>
            <TableCell className="font-bold">{r.broker}</TableCell>
            <TableCell className="text-right">
              <NumberFormater value={r.stock} exchange={exchange} />
            </TableCell>
            <TableCell className="text-right">
              <NumberFormater value={r.etf} exchange={exchange} />
            </TableCell>
            <TableCell className="text-right">
              <NumberFormater value={r.mf} exchange={exchange} />
            </TableCell>
            <TableCell className="text-right">
              <NumberFormater value={r.total} exchange={exchange} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="font-bold">Total</TableCell>
          <TableCell className="text-right font-bold">
            <NumberFormater value={data?.total.stock!} exchange={exchange} />
          </TableCell>
          <TableCell className="text-right font-bold">
            <NumberFormater value={data?.total.etf!} exchange={exchange} />
          </TableCell>
          <TableCell className="text-right font-bold">
            <NumberFormater value={data?.total.mf!} exchange={exchange} />
          </TableCell>
          <TableCell className="text-right font-bold">
            <NumberFormater value={data?.total.total!} exchange={exchange} />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
