import { faDollarSign, faHandHoldingDollar, faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

import { getInvestmentReturn, getTotalInvestment, InvestmentReturnType, TotalInvestmentType } from "@/actions/dashboard.service";
import NumberFormater from "@/components/shared/number-format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { RecentSales } from "../recent-sales";
import { Overview2 } from "./overview2";

export function Overview() {
  const [totalInvestments, setTotalInvestments] = useState<TotalInvestmentType | null>(null);
  const [totalReturns, setTotalReturns] = useState<InvestmentReturnType | null>(null);
  const [returnPercentage, setReturnPercentage] = useState<{ inr: number; usd: number } | null>(null);

  useEffect(() => {
    async function fetchData() {
      const result = await getTotalInvestment();
      const ret = await getInvestmentReturn();
      setTotalInvestments(result);
      setTotalReturns(ret);

      const investmentReturnINR = (ret.profitINR * 100) / result.totalINRInvestments;
      const investmentReturnUSD = (ret.profitUSD * 100) / result.totalUSDInvestments;
      setReturnPercentage({ inr: investmentReturnINR, usd: investmentReturnUSD });
    }
    fetchData();
  }, []);

  if (!totalInvestments || !totalReturns || !returnPercentage) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <FontAwesomeIcon icon={faIndianRupeeSign} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <NumberFormater value={totalInvestments.totalINRInvestments} currency="INR" />
            </div>
            <p className="text-xs text-muted-foreground">Investment Value in India</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <FontAwesomeIcon icon={faDollarSign} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <NumberFormater value={totalInvestments.totalUSDInvestments} currency="USD" />
            </div>
            <p className="text-xs text-muted-foreground">Investment Value in USA</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investment returns</CardTitle>
            <FontAwesomeIcon icon={faHandHoldingDollar} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <NumberFormater value={totalReturns.profitINR} currency="INR" />
            </div>
            <p className="text-xs text-muted-foreground">
              <NumberFormater value={returnPercentage.inr} currency="INR" />% of total investment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investment returns</CardTitle>
            <FontAwesomeIcon icon={faHandHoldingDollar} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <NumberFormater value={totalReturns.profitUSD} currency="USD" />
            </div>
            <p className="text-xs text-muted-foreground">
              <NumberFormater value={returnPercentage.usd} currency="USD" />% of total investment
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview2 />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Total purchase</CardTitle>
            <CardDescription>You made 265 purchase.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
