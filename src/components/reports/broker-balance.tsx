"use client";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { BrokerBalanceType, getBrokerBalance } from "@/actions/report.service";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStockSyncStore } from "@/store/store";

import NumberFormater, { CustomNumericFormat } from "../shared/number-format";

export default function BrokerBalance() {
  const [balance, setBalance] = useState<BrokerBalanceType | null>(null);
  const exchange = useStockSyncStore(useShallow(store => store.exchange));
  useEffect(() => {
    async function fetchData() {
      const returns = await getBrokerBalance(exchange);
      setBalance(returns);
    }
    fetchData();
  }, [exchange]);

  if (!exchange || !balance) {
    return <div>not found!!!</div>;
  }

  return (
    <Table className="caption-top">
      <TableCaption>
        <div className="flex justify-between">Broker balance</div>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Broker</TableHead>
          <TableHead className="text-right">Balance</TableHead>
          <TableHead className="text-right">Stock Count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {balance?.data.map(r => (
          <TableRow key={r.broker}>
            <TableCell className="font-bold">{r.broker}</TableCell>
            <TableCell className="text-right">
              <NumberFormater value={r.balance} exchange={exchange} />
            </TableCell>
            <TableCell className="text-right">
              <CustomNumericFormat value={r.stocks} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="font-bold">Total</TableCell>
          <TableCell className="text-right font-bold">
            <NumberFormater value={balance?.total.balance!} exchange={exchange} />
          </TableCell>
          <TableCell className="text-right font-bold">
            <CustomNumericFormat value={balance.total.stocks} />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
