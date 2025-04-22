import { toDate } from "date-fns";
import { Metadata } from "next";

import { getStockInvestmentByID } from "@/actions/stock-investment.service";
import AddModifyStockInvestment, { StockInvestmentFormValues } from "@/components/investments/stocks/add-modify-stock-investment";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "StockSync : Investments",
};

export const dynamic = "force-dynamic";

export default async function StockInvestmentPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const investment = await getStockInvestmentByID(params.id);
  if (!investment) {
    return <div>Not found</div>;
  }
  const defaultValues: Partial<StockInvestmentFormValues> = {
    price: investment.price,
    qty: investment.qty,
    stt: investment.stt,
    otherCharges: investment.otherCharges,
    brokerage: investment.brokerage,
    broker: investment.broker,
    companyID: investment.companyID.toString(),
    currency: investment.currency,
    purchaseDate: toDate(investment.purchaseDate),
  };
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 w-[650px] md:py-10">
      <h3 className="text-lg font-medium">Edit stock investments</h3>
      <Separator />
      <AddModifyStockInvestment defaultValues={defaultValues} id={+params.id} />
    </section>
  );
}
