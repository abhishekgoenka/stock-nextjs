import { getMutualFundInvestmentByID } from "@/actions/mutual-fund-investment.service";
import AddModifyMFInvestment, { MutualFundInvestmentFormValues } from "@/components/investments/mutual-fund/add-modify-mf-investment";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import { toDate } from "date-fns";

export const metadata: Metadata = {
  title: "StockSync : Investments",
};

export const dynamic = "force-dynamic";

export default async function MutualFundInvestmentPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const investment = await getMutualFundInvestmentByID(params.id);
  if (!investment) {
    return <div>Not found</div>;
  }
  const defaultValues: Partial<MutualFundInvestmentFormValues> = {
    price: investment.price,
    qty: investment.qty,
    stt: investment.stt,
    otherCharges: investment.otherCharges,
    brokerage: investment.brokerage,
    broker: investment.broker,
    mutualFundID: investment.mutualFundID.toString(),
    currency: investment.currency,
    purchaseDate: toDate(investment.purchaseDate),
  };
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 w-[650px] md:py-10">
      <h3 className="text-lg font-medium">Edit mutal fund investments</h3>
      <Separator />
      <AddModifyMFInvestment defaultValues={defaultValues} id={+params.id} />
    </section>
  );
}
