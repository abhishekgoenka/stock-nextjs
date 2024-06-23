import { Metadata } from "next";
import MonthlyInvestment from "@/components/reports/monthly-investments";
import YearlyInvestment from "@/components/reports/yearly-investments";
import { Exchange } from "@/components/shared/exchange";

export const metadata: Metadata = {
  title: "StockSync : Report",
};

export const dynamic = "force-dynamic";

export default async function ReportPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <Exchange />
      <div className="flex gap-10">
        <MonthlyInvestment />
        <YearlyInvestment />
      </div>
      <div className="flex gap-10">
        <MonthlyInvestment />
        <MonthlyInvestment />
      </div>

      {/* <MonthlyInvestment /> */}
    </section>
  );
}
