import AddModifyDeposit, { DepositFormValues } from "@/components/deposit/add-modify-deposit";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StockSync : Fund transfer",
};

export const dynamic = "force-dynamic";

export default async function FundTransferPage() {
  const defaultValues: Partial<DepositFormValues> = {
    amount: 0,
  };
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 w-[650px] md:py-10">
      <h3 className="text-lg font-medium">Add deposit</h3>
      <Separator />
      <AddModifyDeposit defaultValues={defaultValues} />
    </section>
  );
}
