import { Metadata } from "next";

import { getDashboardOverview } from "@/actions/dashboard.service";
import { Dashboard } from "@/components/dashboard/dashboard";

export const metadata: Metadata = {
  title: "StockSync : Dashboard",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardOverview();
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <Dashboard data={data} />
    </section>
  );
}
