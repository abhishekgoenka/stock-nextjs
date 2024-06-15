import { getStockInvestments } from "@/actions/stock-investment.service";
import { Columns } from "@/components/investments/stocks/data-table/columns";
import { DataTable } from "@/components/investments/stocks/data-table/data-table";
import StockInvestment from "@/models/stock-investment.model";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StockSync : Investments",
};

export const dynamic = "force-dynamic";

export default async function StockInvestmentPage() {
  const investments = await getStockInvestments();
  const data: StockInvestment[] = JSON.parse(JSON.stringify(investments));
  console.log(data);
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <DataTable data={data} columns={Columns} />
    </section>
  );
}