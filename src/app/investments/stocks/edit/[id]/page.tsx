import { getStockInvestmentByID } from "@/actions/stock-investment.service";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import { toDate } from "date-fns";
import Investments, { InvestmentFormValues } from "@/components/investments/stocks/investments";

export const metadata: Metadata = {
  title: "StockSync : Investments",
};

export const dynamic = "force-dynamic";

export default async function StockInvestmentPage({ params }: { params: { id: string } }) {
  const investment = await getStockInvestmentByID(params.id);
  if (!investment) {
    return <div>Not found</div>;
  }
  const defaultValues: Partial<InvestmentFormValues> = {
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
      <Investments defaultValues={defaultValues} id={+params.id} />
    </section>
  );
}
