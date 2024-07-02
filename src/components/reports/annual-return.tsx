"use client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import NumberFormater from "../shared/number-format";
import { useEffect, useState } from "react";
import { useStockSyncStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import { AnnualReturnType } from "@/models/annual-return.model";
import { getAnnualReturn } from "@/actions/annual-return.service";
import { Button } from "../ui/button";

export default function AnnualReturn() {
  const [annualReturns, setAnnualReturns] = useState<AnnualReturnType[]>([]);
  const exchange = useStockSyncStore(useShallow(store => store.exchange));
  useEffect(() => {
    async function fetchData() {
      const returns = await getAnnualReturn(exchange);
      setAnnualReturns(returns);
    }
    fetchData();
  }, [exchange]);

  if (!exchange) {
    return <div>Not found!!!</div>;
  }

  return (
    <Table className="caption-top">
      <TableCaption>
        <div className="flex justify-between">
          Annual Returns
          <span className="text-right">
            <Button>Add Annual Return</Button>
          </span>
        </div>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Year</TableHead>
          <TableHead className="text-right">Investments</TableHead>
          <TableHead className="text-right">Expected Return(12%)</TableHead>
          <TableHead className="text-right">Actual Return</TableHead>
          <TableHead className="text-right">Actual Return(%)</TableHead>
          <TableHead className="text-right">Index Returns</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {annualReturns.map(r => (
          <TableRow key={r.id}>
            <TableCell className="font-bold">{r.year}</TableCell>
            <TableCell className="text-right">
              <NumberFormater value={r.investments} exchange={exchange} />
            </TableCell>
            <TableCell className="text-right">
              <NumberFormater value={r.expectedReturn} exchange={exchange} />
            </TableCell>
            <TableCell className="text-right">
              <NumberFormater value={r.actualReturn} exchange={exchange} />
            </TableCell>
            <TableCell className="text-right">
              <NumberFormater value={r.actualReturnPercentage} exchange={exchange} />
            </TableCell>
            <TableCell className="text-right">
              <NumberFormater value={r.indexReturn} exchange={exchange} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
