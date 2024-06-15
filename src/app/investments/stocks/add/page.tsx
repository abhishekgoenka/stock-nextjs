import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StockSync : Investments",
};

export const dynamic = "force-dynamic";

export default async function StockInvestmentPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      hello world
    </section>
  );
}
