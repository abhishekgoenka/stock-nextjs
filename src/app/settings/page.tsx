import { Metadata } from "next";

import SyncPrices from "@/components/settings/sync-price";

export const metadata: Metadata = {
  title: "StockSync : Settings",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <SyncPrices />
    </section>
  );
}
