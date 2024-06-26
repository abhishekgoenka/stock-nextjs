"use client";
import { getCompanies, updateCompany } from "@/actions/company.service";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { round } from "lodash";
import { useState } from "react";
import { syncStockPrice } from "@/actions/setting.service";
import { getMFs, updateMF } from "@/actions/mutual-fund.service";

type FetchStatus = {
  isLoading: boolean;
  percentage: number;
  name: string;
};

export default function SyncPrices() {
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>({ isLoading: false, name: "", percentage: 0 });

  const handleSyncStockPrice = async () => {
    setFetchStatus(prev => ({ ...prev, isLoading: true }));
    const companies = await getCompanies();
    const nscCompanies = companies.filter(e => e.exchange === "NSE");
    let index = 1;
    for (const company of nscCompanies) {
      const percentage = round((index * 100) / nscCompanies.length, 0);
      setFetchStatus(prev => ({ ...prev, name: company.name, percentage }));

      //get price
      const price = await syncStockPrice(company.symbol);

      //update price
      company.currentPrice = price.priceInfo.close;
      await updateCompany(company);

      index++;
    }

    setFetchStatus(prev => ({ ...prev, isLoading: false, name: "" }));
  };

  const handleSyncMutualFundPrice = async () => {
    setFetchStatus(prev => ({ ...prev, isLoading: true }));
    const mfs = await getMFs();
    let index = 1;
    for (const mf of mfs) {
      const percentage = round((index * 100) / mfs.length, 0);
      setFetchStatus(prev => ({ ...prev, name: mf.name, percentage }));

      //get price
      const url = `https://api.mfapi.in/mf/${mf.symbol}/latest`;
      const result = await fetch(url);
      const response = await result.json();
      console.log(response);
      if (response.data && response.status === "SUCCESS") {
        //update price
        mf.currentPrice = response.data[0].nav;
        await updateMF(mf);
      }
      index++;
    }

    setFetchStatus(prev => ({ ...prev, isLoading: false, name: "" }));
  };

  return (
    <div>
      <div className="flex gap-4">
        <Button onClick={handleSyncStockPrice}>Sync Stock Price</Button>
        <Button onClick={handleSyncMutualFundPrice}>Sync Mutual Fund Price</Button>
        <Button variant="secondary">Sync USA Stock Price</Button>
      </div>
      {fetchStatus.isLoading && (
        <div className="mt-4">
          <Progress value={fetchStatus.percentage} />
          <Label>Fetching price for {fetchStatus.name}...</Label>
        </div>
      )}
    </div>
  );
}
