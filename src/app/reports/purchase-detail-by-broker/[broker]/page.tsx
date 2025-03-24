import PurchaseDetailByBroker from "@/components/reports/purchase-detail-by-broker/purchase-detail-by-broker";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StockSync : Purchase detail by broker",
};

export const dynamic = "force-dynamic";

export default async function PurchaseDetailStockPage(props: { params: Promise<{ broker: string }> }) {
  const params = await props.params;
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <PurchaseDetailByBroker broker={params.broker} />
    </section>
  );
}
