"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { addSales } from "@/actions/sale.service";
import { toastDBSaveError, toastDBSaveSuccess } from "@/components/shared/toast-message";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StockOrMutualFundType } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { CustomNumericFormat } from "../shared/number-format";
import { Calendar } from "../ui/calendar";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const salesFormSchema = z.object({
  company: z.string().min(1),
  purchaseDate: z.date(),
  saleDate: z.date(),
  qty: z.coerce.number().min(1),
  purchasePrice: z.coerce.number().min(1),
  salePrice: z.coerce.number().min(1),
  charges: z.coerce.number(),
  exchange: z.string().min(3, "Select exchange"),
  currency: z.string(),
  broker: z.string(),
});

export type SalesFormValues = z.infer<typeof salesFormSchema>;
type SalesProps = {
  defaultValues: Partial<SalesFormValues>;
  type: StockOrMutualFundType;
  companyID: number;
  investmentID: number;
};

export default function InvestmentSales({ defaultValues, type, companyID, investmentID }: SalesProps) {
  const router = useRouter();
  const [netAmount, setNetAmount] = useState(0);
  const form = useForm<SalesFormValues>({
    resolver: zodResolver(salesFormSchema),
    defaultValues,
    mode: "onChange",
  });
  async function onSubmit(data: SalesFormValues) {
    const { company, purchaseDate, saleDate, qty, purchasePrice, salePrice, charges, exchange, currency, broker } = data;
    // let result: number | StockInvestmentType | null;
    const result = await addSales(
      {
        company,
        broker,
        charges,
        currency,
        exchange,
        purchaseDate: purchaseDate.toISOString(),
        purchasePrice,
        qty,
        saleDate: saleDate.toISOString(),
        salePrice: salePrice,
      },
      type,
      investmentID,
    );

    if (result) {
      toastDBSaveSuccess();
      if (type === "stock") {
        router.push(`/reports/purchase-detail/stock/${companyID}`);
      } else if (type === "mf") {
        router.push(`/reports/purchase-detail/mf/${companyID}`);
      }
    } else {
      toastDBSaveError();
    }
  }

  const calculateNetAmount = () => {
    const { qty, salePrice, charges } = form.getValues();
    const amt = qty * +salePrice + +charges;
    setNetAmount(amt);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock/Mutual fund</FormLabel>
              <FormControl>
                <Input placeholder="Stock/Mutual fund name" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-3">
          <FormField
            control={form.control}
            name="purchaseDate"
            render={({ field }) => (
              <FormItem className="flex flex-col mt-2">
                <FormLabel>Purchase Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")} disabled>
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={date => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="saleDate"
            render={({ field }) => (
              <FormItem className="flex flex-col mt-2">
                <FormLabel>Sale Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={date => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem className="w-44">
            <FormLabel>Net Amount</FormLabel>
            <FormControl className="mt-5">
              <Label className="block !mt-5">
                <CustomNumericFormat value={netAmount} />
              </Label>
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        <div className="flex justify-between gap-3">
          <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Purchase Price" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sale Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Sale Price"
                    {...field}
                    onChange={e => {
                      field.onChange(e), calculateNetAmount();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="qty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qty</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Qty"
                    {...field}
                    onChange={e => {
                      field.onChange(e), calculateNetAmount();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="charges"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Charges</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Charges"
                    {...field}
                    onChange={e => {
                      field.onChange(e), calculateNetAmount();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-between gap-3">
          <FormField
            control={form.control}
            name="exchange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exchange</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="broker"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Broker</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-3">
          <Button type="submit">Sale Investments</Button>
          <Button type="button" variant="destructive" onClick={() => router.push("/investments/stocks")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
