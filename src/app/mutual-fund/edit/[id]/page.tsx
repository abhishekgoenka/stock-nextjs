import { getMFByID } from "@/actions/mutual-fund.service";
import AddModifyMutualFund, { MutualFundFormValues } from "@/components/mutual-fund/add-modify-mutualfund";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StockSync : Mutual Fund",
};

export const dynamic = "force-dynamic";

export default async function StockInvestmentPage({ params }: { params: { id: string } }) {
  const mutualFund = await getMFByID(params.id);
  if (!mutualFund) {
    return <div>Not found</div>;
  }
  const defaultValues: Partial<MutualFundFormValues> = {
    equity: mutualFund.equity,
    debt: mutualFund.debt,
    others: mutualFund.others,
    largeCap: mutualFund.largeCap,
    midCap: mutualFund.midCap,
    smallCap: mutualFund.smallCap,
    otherCap: mutualFund.otherCap,
    currentPrice: mutualFund.currentPrice,
    indexFund: mutualFund.indexFund,
    exchange: mutualFund.exchange,
    name: mutualFund.name,
    symbol: mutualFund.symbol,
    url: mutualFund.url,
  };
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 w-[650px] md:py-10">
      <h3 className="text-lg font-medium">Edit Mutual Fund</h3>
      <Separator />
      <AddModifyMutualFund defaultValues={defaultValues} id={+params.id} />
    </section>
  );
}
