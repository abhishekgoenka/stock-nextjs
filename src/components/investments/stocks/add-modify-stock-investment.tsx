"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BROKERS, CURRENCY } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { addStockInvestment, updateStockInvestment } from "@/actions/stock-investment.service";
import { useRouter } from "next/navigation";
import { toastDBSaveError, toastDBSaveSuccess } from "@/components/shared/toast-message";
import { getCompanies } from "@/actions/company.service";
import { StockInvestmentType } from "@/models/stock-investment.model";
import { CustomNumericFormat } from "@/components/shared/number-format";

const stockInvestmentFormSchema = z.object({
  companyID: z.string(),
  purchaseDate: z.date(),
  qty: z.coerce.number().min(1, { message: "Quantity should be greater than zero" }),
  price: z.coerce.number(),
  stt: z.coerce.number(),
  brokerage: z.coerce.number(),
  otherCharges: z.coerce.number(),
  currency: z.string(),
  broker: z.string(),
});

export type StockInvestmentFormValues = z.infer<typeof stockInvestmentFormSchema>;
type AddInvestmentsProps = {
  defaultValues: Partial<StockInvestmentFormValues>;
  id?: number;
};

export default function AddModifyStockInvestment({ defaultValues, id }: AddInvestmentsProps) {
  const router = useRouter();
  const [netAmount, setNetAmount] = useState(0);
  const [companies, setCompanies] = useState<{ id: number; name: string }[]>([]);
  const form = useForm<StockInvestmentFormValues>({
    resolver: zodResolver(stockInvestmentFormSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    async function fetchData() {
      const companies = await getCompanies();
      const companyList = companies.map(c => {
        return { id: c.id!, name: c.name };
      });
      setCompanies(companyList);
      calculateNetAmount();
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(data: StockInvestmentFormValues) {
    const { companyID, purchaseDate, qty, price, stt, brokerage, otherCharges, currency, broker } = data;
    let result: number | StockInvestmentType | null;
    if (id) {
      result = await updateStockInvestment({
        id: id,
        companyID: +companyID,
        purchaseDate: purchaseDate.toISOString(),
        qty: +qty,
        price: +price,
        stt: +stt,
        brokerage: +brokerage,
        otherCharges: +otherCharges,
        currency,
        broker,
      });
    } else {
      result = await addStockInvestment({
        companyID: +companyID,
        purchaseDate: purchaseDate.toISOString(),
        qty: +qty,
        price: +price,
        stt: +stt,
        brokerage: +brokerage,
        otherCharges: +otherCharges,
        currency,
        broker,
      });
    }
    if (result) {
      toastDBSaveSuccess();
      router.push("/investments/stocks");
    } else {
      toastDBSaveError();
    }
  }

  const calculateNetAmount = () => {
    const { qty, price, stt, brokerage, otherCharges } = form.getValues();
    const amt = qty * +price + +stt + +brokerage + +otherCharges;
    setNetAmount(amt);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="companyID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {companies.map(c => (
                      <SelectItem key={c.name} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <FormField
              control={form.control}
              name="broker"
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormLabel>Broker</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a broker" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BROKERS.map(b => (
                        <SelectItem key={b.value} value={b.value}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem className="w-36">
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CURRENCY.map(b => (
                        <SelectItem key={b.value} value={b.value}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem className="flex flex-col mt-2">
                  <FormLabel>Purchase Date</FormLabel>
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
          </div>

          <div className="flex justify-between gap-3">
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Price"
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
              name="stt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>STT</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="STT"
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
              name="brokerage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brokerage</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Brokerage"
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
              name="otherCharges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Charges</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Other Charges"
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
          <div className="flex gap-3">
            <Button type="submit">Save Investments</Button>
            <Button type="button" variant="destructive" onClick={() => router.push("/investments/stocks")}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
