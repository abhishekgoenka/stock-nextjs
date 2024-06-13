import { DataTable } from "@/components/ui/data-table/data-table";

import { Metadata } from "next";
import { CompanyService } from "@/actions/company.service";
import { Columns } from "@/components/companies/columns";
import Company from "@/models/company.model";

export const metadata: Metadata = {
  title: "StockSync : Companies",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const comp = new CompanyService();
  const companies = await comp.getCompanies();
  const data: Company[] = JSON.parse(JSON.stringify(companies));
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <DataTable data={data} columns={Columns} />
    </section>
  );
}
