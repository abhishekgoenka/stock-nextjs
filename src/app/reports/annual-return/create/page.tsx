import AddModifyAnnualReturn, { AnnualReturnFormValues } from "@/components/reports/annual-return/add-modify-annual-return";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StockSync : Annual Return",
};

export const dynamic = "force-dynamic";

export default async function FundTransferPage() {
  const defaultValues: Partial<AnnualReturnFormValues> = {
    year: "",
    investments: 0,
    expectedReturn: 0,
    actualReturn: 0,
    actualReturnPercentage: 0,
    indexReturn: 0,
    exchange: "",
  };
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 w-[650px] md:py-10">
      <h3 className="text-lg font-medium">Add annual return</h3>
      <Separator />
      <AddModifyAnnualReturn defaultValues={defaultValues} />
    </section>
  );
}
