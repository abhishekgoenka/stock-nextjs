import { Metadata } from "next";
import { getDeposits } from "@/actions/deposit.service";
import { Columns } from "@/components/deposit/data-table/columns";
import { DataTable } from "@/components/deposit/data-table/data-table";

export const metadata: Metadata = {
  title: "StockSync : Fund transfer",
};

export const dynamic = "force-dynamic";

export default async function FundTransferPage() {
  const mfs = await getDeposits();
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <DataTable data={mfs} columns={Columns} />
    </section>
  );
}
