import { Metadata } from "next";
import { MutualFundService } from "@/actions/mutual-fund.service";
import MutualFund from "@/models/mutual-fund.model";
import { Columns } from "@/components/mutual-fund/data-table/columns";
import { DataTable } from "@/components/mutual-fund/data-table/data-table";

export const metadata: Metadata = {
  title: "StockSync : Mutual fund",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const mf = new MutualFundService();
  const mfs = await mf.getMFs();
  const data: MutualFund[] = JSON.parse(JSON.stringify(mfs));
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <DataTable data={data} columns={Columns} />
    </section>
  );
}
