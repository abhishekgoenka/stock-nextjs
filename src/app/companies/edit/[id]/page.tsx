import { getCompanyByID } from "@/actions/company.service";
import AddModifyCompany, { CompanyFormValues } from "@/components/companies/add-modify-company";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StockSync : Companies",
};

export const dynamic = "force-dynamic";

export default async function StockInvestmentPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const company = await getCompanyByID(params.id);
  if (!company) {
    return <div>Not found</div>;
  }
  const defaultValues: Partial<CompanyFormValues> = {
    name: company.name,
    sector: company.sector,
    url: company.url,
    type: company.type,
    exchange: company.exchange,
    symbol: company.symbol,
    currentPrice: company.currentPrice,
  };
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 w-[650px] md:py-10">
      <h3 className="text-lg font-medium">Edit Company</h3>
      <Separator />
      <AddModifyCompany defaultValues={defaultValues} id={+params.id} />
    </section>
  );
}
