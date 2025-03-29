"use client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import NumberFormater, { CustomNumericFormat } from "../shared/number-format";
import { useEffect, useState } from "react";
import { useStockSyncStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import { AnnualReturnType } from "@/models/annual-return.model";
import { getAnnualReturn } from "@/actions/annual-return.service";
import { Button } from "../ui/button";
import Link from "next/link";

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

  const onAnualReturnClickHandler = () => {
    window.location.href = "/reports/annual-return/create";
  };

  return (
    <Table className="caption-top">
      <TableCaption>
        <div className="flex justify-between">
          Annual Returns
          <div className="flex gap-4 flex-row-reverse">
            <Button onClick={onAnualReturnClickHandler}>Add Annual Return</Button>
          </div>
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
              <CustomNumericFormat suffix={"%"} value={r.actualReturnPercentage} />
            </TableCell>
            <TableCell className="text-right">
              <CustomNumericFormat suffix={"%"} value={r.indexReturn} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
