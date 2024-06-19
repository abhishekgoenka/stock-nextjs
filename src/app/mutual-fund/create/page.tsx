import AddModifyMutualFund, { MutualFundFormValues } from "@/components/mutual-fund/add-modify-mutualfund";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StockSync : Mutual Fund",
};

export const dynamic = "force-dynamic";

export default async function StockInvestmentPage() {
  const defaultValues: Partial<MutualFundFormValues> = {
    equity: 0,
    debt: 0,
    others: 0,
    largeCap: 0,
    midCap: 0,
    smallCap: 0,
    otherCap: 0,
    currentPrice: 0,
    indexFund: false,
  };
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 w-[650px] md:py-10">
      <h3 className="text-lg font-medium">Add Mutual Fund</h3>
      <Separator />
      <AddModifyMutualFund defaultValues={defaultValues} />
    </section>
  );
}
