import { getDepositByID } from "@/actions/deposit.service";
import AddModifyDeposit, { DepositFormValues } from "@/components/deposit/add-modify-deposit";
import { Separator } from "@/components/ui/separator";
import { toDate } from "date-fns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StockSync : Fund transfer",
};

export const dynamic = "force-dynamic";

export default async function FundTransferPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const deposit = await getDepositByID(params.id);
  if (!deposit) {
    return <div>Not found</div>;
  }
  const defaultValues: Partial<DepositFormValues> = {
    amount: deposit.amount,
    currency: deposit.currency,
    date: toDate(deposit.date),
    desc: deposit.desc,
    from: deposit.from,
    to: deposit.to,
  };
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 w-[650px] md:py-10">
      <h3 className="text-lg font-medium">Edit deposit</h3>
      <Separator />
      <AddModifyDeposit defaultValues={defaultValues} type="Fund Transfer" id={+params.id} />
    </section>
  );
}
