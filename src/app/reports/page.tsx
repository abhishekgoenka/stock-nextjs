import { Metadata } from "next";
import MonthlyInvestment from "@/components/reports/monthly-investments";
import YearlyInvestment from "@/components/reports/yearly-investments";
import { Exchange } from "@/components/shared/exchange";
import InvestmentReturn from "@/components/reports/investment-return";
import InvestmentByBroker from "@/components/reports/investment-by-broker";
import BrokerBalance from "@/components/reports/broker-balance";

export const metadata: Metadata = {
  title: "StockSync : Report",
};

export const dynamic = "force-dynamic";

export default async function ReportPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <Exchange />
      <div className="flex gap-10">
        <div className=" w-6/12">
          <MonthlyInvestment />
        </div>

        <div className="flex flex-col gap-5 w-6/12">
          <YearlyInvestment />
          <InvestmentReturn />
        </div>
      </div>
      <div className="flex gap-10">
        <div className="flex">
          <InvestmentByBroker />
        </div>

        <BrokerBalance />
      </div>
      {/* <div className="flex gap-10">
        <InvestmentReturn />
        <MonthlyInvestment />
      </div> */}

      {/* <MonthlyInvestment /> */}
    </section>
  );
}
