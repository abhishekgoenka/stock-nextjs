import { toDate } from "date-fns";
import { Metadata } from "next";

import { getMutualFundInvestmentByID } from "@/actions/mutual-fund-investment.service";
import InvestmentSales, { SalesFormValues } from "@/components/sales/investment-sales";

export const metadata: Metadata = {
  title: "StockSync : Sales",
};

export const dynamic = "force-dynamic";

export default async function MutualFundalesPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const investment = await getMutualFundInvestmentByID(params.id);
  if (!investment) {
    return <div>Not found</div>;
  }
  const defaultValues: Partial<SalesFormValues> = {
    company: investment.mutualFund?.name,
    purchaseDate: toDate(investment.purchaseDate),
    qty: investment.qty,
    purchasePrice: investment.price,
    salePrice: 0,
    charges: 0,
    exchange: investment.mutualFund?.exchange,
    currency: investment.currency,
    broker: investment.broker,
  };
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 w-[650px] md:py-10">
      <h3 className="text-lg font-medium">Sale Stock</h3>
      <InvestmentSales defaultValues={defaultValues} type="mf" companyID={investment.mutualFundID} investmentID={+params.id} />
    </section>
  );
}
