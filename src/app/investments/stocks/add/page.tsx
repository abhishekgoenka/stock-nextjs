import AddInvestments from "@/components/investments/stocks/add/add-investments";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StockSync : Investments",
};

export const dynamic = "force-dynamic";

export default async function StockInvestmentPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 w-[650px] md:py-10">
      <h3 className="text-lg font-medium">Add stock investments</h3>
      <Separator />
      <AddInvestments />
    </section>
  );
}
