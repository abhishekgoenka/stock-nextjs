import { Metadata } from "next";

import { getMutualFundInvestments } from "@/actions/mutual-fund-investment.service";
import { Columns } from "@/components/investments/mutual-fund/data-table/columns";
import { DataTable } from "@/components/investments/mutual-fund/data-table/data-table";
import MutualFundInvestment from "@/models/mutual-fund-investment.model";

export const metadata: Metadata = {
  title: "StockSync : Investments",
};

export const dynamic = "force-dynamic";

export default async function MutualFundInvestmentPage() {
  const investments = await getMutualFundInvestments();
  const data: MutualFundInvestment[] = JSON.parse(JSON.stringify(investments));
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <DataTable data={data} columns={Columns} />
    </section>
  );
}
