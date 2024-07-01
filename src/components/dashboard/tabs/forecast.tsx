import { EstimatedReturnType, getEstimatedReturn } from "@/actions/dashboard.service";
import NumberFormater from "@/components/shared/number-format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentSales } from "../recent-sales";
import { Overview2 } from "./overview2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faIndianRupeeSign, faGear } from "@fortawesome/free-solid-svg-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export function Forecast() {
  const [year, setYear] = useState("2042");
  const [estimatedReturn, setEstimatedReturn] = useState<EstimatedReturnType | null>(null);

  useEffect(() => {
    async function fetchData() {
      const result = await getEstimatedReturn(+year);
      setEstimatedReturn(result);
    }
    fetchData();
  }, [year]);

  if (!estimatedReturn) {
    return <div>Loading...</div>;
  }

  const ChangeYear = () => {
    return (
      <div className="flex justify-between">
        <p className="text-xs text-muted-foreground">By the year {year}</p>
        <Popover>
          <PopoverTrigger>
            <FontAwesomeIcon icon={faGear} />
          </PopoverTrigger>
          <PopoverContent className="w-44">
            <RadioGroup defaultValue={year} onValueChange={setYear}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2042" id="2042" />
                <Label htmlFor="2042">By the year 2042</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2033" id="2033" />
                <Label htmlFor="2033">By the year 2033</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2029" id="2029" />
                <Label htmlFor="2029">By the year 2029</Label>
              </div>
            </RadioGroup>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated returns at 12%</CardTitle>
            <FontAwesomeIcon icon={faIndianRupeeSign} />
          </CardHeader>
          <CardContent>
            <NumberFormater className="text-2xl font-bold" value={estimatedReturn.projectedINRReturn12} currency="INR" />
            <ChangeYear />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated returns at 15%</CardTitle>
            <FontAwesomeIcon icon={faIndianRupeeSign} />
          </CardHeader>
          <CardContent>
            <NumberFormater className="text-2xl font-bold" value={estimatedReturn.projectedINRReturn15} currency="INR" />
            <ChangeYear />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated returns at 12%</CardTitle>
            <FontAwesomeIcon icon={faDollarSign} />
          </CardHeader>
          <CardContent>
            <NumberFormater className="text-2xl font-bold" value={estimatedReturn.projectedUSDReturn12} currency="USD" />
            <ChangeYear />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated returns at 15%</CardTitle>
            <FontAwesomeIcon icon={faDollarSign} />
          </CardHeader>
          <CardContent>
            <NumberFormater className="text-2xl font-bold" value={estimatedReturn.projectedUSDReturn15} currency="USD" />
            <ChangeYear />
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
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made 265 sales this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
