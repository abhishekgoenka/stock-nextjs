import StockPurchaseDetail from "@/components/reports/purchase-detail/stock-purchase-detail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StockSync : Purchase detail",
};

export const dynamic = "force-dynamic";

export default async function PurchaseDetailStockPage({ params }: { params: { id: string } }) {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <StockPurchaseDetail id={+params.id} type="stock" />
    </section>
  );
}
