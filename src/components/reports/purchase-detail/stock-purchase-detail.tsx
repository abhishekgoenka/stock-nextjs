"use client";

import { PurchaseDetailType, getPurchaseDetail } from "@/actions/purchase-detail.service";
import NumberFormater from "@/components/shared/number-format";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useExchange } from "@/store/useExchange";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";

type StockPurchaseDetailProps = {
  id: number;
  type: "stock" | "mf";
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
  return (
    <>
      <Table className="caption-top">
        <TableCaption>
          <h1 className="my-4 text-xl">Purchase Detail</h1>
          <div className="flex justify-between">
            <div>
              Current price : <NumberFormater className="text-black" value={data.currentPrice} currency={data?.data[0]?.currency} />
            </div>
            <div>
              XIRR : <NumericFormat className="text-black" displayType="text" decimalScale={2} fixedDecimalScale value={data.totalXIRR} />
            </div>
            <div>
              Profit/Loss : <NumberFormater className="text-black" value={data.returns} currency={data?.data[0]?.currency} />
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              Average Price : <NumberFormater className="text-black" value={data.avgPrice} currency={data?.data[0]?.currency} />
            </div>
            <div>
              Qty : <NumericFormat className="text-black" displayType="text" decimalScale={2} fixedDecimalScale value={data.qty} />
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
              <NumericFormat displayType="text" decimalScale={2} fixedDecimalScale value={data.growthRate.percentage10} />
            </TableCell>
            <TableCell className="text-center">
              <NumericFormat displayType="text" decimalScale={2} fixedDecimalScale value={data.growthRate.percentage12} />
            </TableCell>
            <TableCell className="text-center">
              <NumericFormat displayType="text" decimalScale={2} fixedDecimalScale value={data.growthRate.percentage15} />
            </TableCell>
            <TableCell className="text-center">
              <NumericFormat displayType="text" decimalScale={2} fixedDecimalScale value={data.growthRate.percentage18} />
            </TableCell>
            <TableCell className="text-center">
              <NumericFormat displayType="text" decimalScale={2} fixedDecimalScale value={data.growthRate.percentage24} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">Name</TableHead>
            <TableHead className="">Date</TableHead>
            <TableHead className="text-right">Qty </TableHead>
            <TableHead className="text-right">Price </TableHead>
            <TableHead>Broker</TableHead>
            <TableHead className="text-right">XIRR</TableHead>
            <TableHead className="text-right">CAGR</TableHead>
            <TableHead className="text-right">Profit/Loss</TableHead>
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
              <TableCell className="text-right">
                <NumericFormat displayType="text" decimalScale={2} value={r.XIRR} />
              </TableCell>
              <TableCell className="text-right">
                <NumericFormat displayType="text" decimalScale={2} value={r.CAGR} />
              </TableCell>
              <TableCell className="text-right text-primary">
                <NumberFormater value={r.currentAmount - r.netAmount} currency={r.currency} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
