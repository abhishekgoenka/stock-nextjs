import { Metadata } from "next";

import AddModifyCompany, { CompanyFormValues } from "@/components/companies/add-modify-company";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "StockSync : Companies",
};

export const dynamic = "force-dynamic";

export default async function StockInvestmentPage() {
  const defaultValues: Partial<CompanyFormValues> = {
    name: "",
    sector: "",
    url: "",
    type: "",
    exchange: "",
    symbol: "",
    currentPrice: 0,
  };
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 w-[650px] md:py-10">
      <h3 className="text-lg font-medium">Add Company</h3>
      <Separator />
      <AddModifyCompany defaultValues={defaultValues} />
    </section>
  );
}
