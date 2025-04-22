import { Metadata } from "next";

import StockPurchaseDetail from "@/components/reports/purchase-detail/stock-purchase-detail";

export const metadata: Metadata = {
  title: "StockSync : Purchase detail",
};

export const dynamic = "force-dynamic";

export default async function PurchaseDetailStockPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <StockPurchaseDetail id={+params.id} type="mf" />
    </section>
  );
}
