"use client";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { expectedReturn, ExpectedReturnType } from "@/actions/report.service";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStockSyncStore } from "@/store/store";

import NumberFormater from "../shared/number-format";
import { Button } from "../ui/button";

export default function InvestmentReturn() {
  const [expected, setExpected] = useState<ExpectedReturnType | null>(null);
  const exchange = useStockSyncStore(useShallow(store => store.exchange));
  useEffect(() => {
    async function fetchData() {
      const returns = await expectedReturn(exchange);
      setExpected(returns);
    }
    fetchData();
  }, [exchange]);

  if (!exchange) {
    return <div>not found!!!</div>;
  }

  const getBroker = (broker: string) => {
    switch (broker) {
      case "Stock GROWW":
      case "Mutual Fund GROWW":
        return "GROWW";
      case "Stock DHANN":
        return "DHANN";
      default:
        return broker;
    }
  };

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
            <TableCell className="font-bold">
              <Button
                size="sm"
                variant="link"
                onClick={() => {
                  window.location.href = `/reports/purchase-detail-by-broker/${getBroker(r.broker)}`;
                }}
              >
                {r.broker}
              </Button>
            </TableCell>
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
