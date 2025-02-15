"use client";

import { InvestmentDetailType, PurchaseDetailType, getPurchaseDetail } from "@/actions/purchase-detail.service";
import NumberFormater, { CustomNumericFormat } from "@/components/shared/number-format";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StockOrMutualFundType } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";

type StockPurchaseDetailProps = {
  id: number;
  type: StockOrMutualFundType;
};

export default function StockPurchaseDetail({ id, type }: StockPurchaseDetailProps) {
  const [data, setData] = useState<PurchaseDetailType | null>(null);
  useEffect(() => {
    async function fetchData() {
      const returns = await getPurchaseDetail(type, id);
      setData(returns);
    }
    fetchData();
  }, [id, type]);

  if (!data) {
    return <div>not found!!!</div>;
  }

  const currency = data?.data[0]?.currency;
  const profit = (r: InvestmentDetailType) => r.currentAmount - r.netAmount;
  return (
    <>
      <Table className="caption-top">
        <TableCaption>
          <h1 className="my-4 text-xl">Purchase Detail</h1>
          <div className="flex justify-between">
            <div>
              Current price : <NumberFormater className="text-black" value={data.currentPrice} currency={currency} />
            </div>
            <div>
              XIRR : <CustomNumericFormat className="text-black" value={data.totalXIRR} suffix="%" />
            </div>
            <div>
              Profit/Loss : <NumberFormater className="text-black" value={data.returns} currency={currency} />
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              Average Price : <NumberFormater className="text-black" value={data.avgPrice} currency={data?.data[0]?.currency} />
            </div>
            <div>
              Qty : <CustomNumericFormat className="text-black" value={data.qty} />
            </div>
            <div>
              Invested : <NumberFormater className="text-black" value={data.investedValue} currency={data?.data[0]?.currency} />
            </div>
          </div>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">10%</TableHead>
            <TableHead className="text-center">12%</TableHead>
            <TableHead className="text-center">15%</TableHead>
            <TableHead className="text-center">18%</TableHead>
            <TableHead className="text-center">24%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-center">
              <NumberFormater className="text-black" value={data.growthRate.percentage10} currency={currency} />
            </TableCell>
            <TableCell className="text-center">
              <NumberFormater className="text-black" value={data.growthRate.percentage12} currency={currency} />
            </TableCell>
            <TableCell className="text-center">
              <NumberFormater className="text-black" value={data.growthRate.percentage15} currency={currency} />
            </TableCell>
            <TableCell className="text-center">
              <NumberFormater className="text-black" value={data.growthRate.percentage18} currency={currency} />
            </TableCell>
            <TableCell className="text-center">
              <NumberFormater className="text-black" value={data.growthRate.percentage24} currency={currency} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">Name</TableHead>
            <TableHead className="">Date</TableHead>
            <TableHead className="text-center">Qty </TableHead>
            <TableHead className="text-center">Price </TableHead>
            <TableHead>Broker</TableHead>
            <TableHead className="text-center">XIRR</TableHead>
            <TableHead className="text-right">Overall Gain</TableHead>
            <TableHead className="text-right">Profit/Loss</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data.map(r => (
            <TableRow key={r.id}>
              <TableCell className="font-bold">{r.name}</TableCell>
              <TableCell>{format(r.purchaseDate, "PPP")}</TableCell>
              <TableCell className="text-right">{r.qty}</TableCell>
              <TableCell className="text-right">
                <NumberFormater value={r.price} currency={r.currency} />
              </TableCell>
              <TableCell>{r.broker}</TableCell>
              <TableCell className={cn("text-right ", { "text-primary": r.XIRR > 0 }, { "text-destructive": r.XIRR < 0 })}>
                <CustomNumericFormat value={r.XIRR} suffix="%" />
              </TableCell>
              <TableCell className={cn("text-right ", { "text-primary": r.overallGain > 0 }, { "text-destructive": r.overallGain < 0 })}>
                <CustomNumericFormat value={r.overallGain} suffix="%" />
              </TableCell>
              <TableCell className={cn("text-right ", { "text-primary": profit(r) > 0 }, { "text-destructive": profit(r) < 0 })}>
                <NumberFormater value={profit(r)} currency={r.currency} />
              </TableCell>
              <TableCell className="text-center ">
                <Button variant={"link"}>
                  <Link className="w-full" href={`/sales/stock/${r?.id}`} rel="noopener noreferrer">
                    Sales
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
