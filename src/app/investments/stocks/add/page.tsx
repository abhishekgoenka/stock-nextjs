import { getCompanies } from "@/actions/company.service";
import AddInvestments from "@/components/investments/stocks/add/add-investments";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StockSync : Investments",
};

export const dynamic = "force-dynamic";

export default async function StockInvestmentPage() {
  const companies = await getCompanies();
  const companyList = companies.map(c => {
    return { id: c.id!, name: c.name };
  });
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 w-[650px] md:py-10">
      <h3 className="text-lg font-medium">Add stock investments</h3>
      <Separator />
      <AddInvestments companies={companyList} />
    </section>
  );
}
