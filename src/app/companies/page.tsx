import { DataTable } from "@/components/companies/data-table/data-table";

import { Metadata } from "next";
import { getCompanies } from "@/actions/company.service";
import { Columns } from "@/components/companies/data-table/columns";

export const metadata: Metadata = {
  title: "StockSync : Companies",
};

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const companies = await getCompanies();
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <DataTable data={companies} columns={Columns} />
    </section>
  );
}
