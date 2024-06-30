"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardOverviewType } from "@/actions/dashboard.service";
import { Overview } from "./tabs/overview";
import { Forecast } from "./tabs/forecast";
import { Stocks } from "./tabs/stocks";

type DashboardProps = {
  data: DashboardOverviewType;
};
export function Dashboard({ data }: DashboardProps) {
  return (
    <div className="flex-1 space-y-4">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Mutual Funds
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Overview />
        </TabsContent>
        <TabsContent value="forecast" className="space-y-4">
          <Forecast />
        </TabsContent>
        <TabsContent value="stocks" className="space-y-4">
          <Stocks data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
