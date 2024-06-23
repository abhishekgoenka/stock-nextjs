"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENCY, DEPOSIT_TYPE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toastDBSaveError, toastDBSaveSuccess } from "@/components/shared/toast-message";
import { addDeposit, updateDeposit } from "@/actions/deposit.service";
import { DepositType } from "@/models/deposit.model";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";

const FROM = ["Bank", "GROWW", "DHAN", "WEBULL", "Fidility - Roth", "Fidility - Traditional", "Fidility - Individual"];

const depositFormSchema = z.object({
  date: z.date(),
  desc: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  currency: z.string(),
  amount: z.coerce.number(),
});

export type DepositFormValues = z.infer<typeof depositFormSchema>;
type AddModifyDepositProps = {
  defaultValues: Partial<DepositFormValues>;
  id?: number;
};

export default function AddModifyDeposit({ defaultValues, id }: AddModifyDepositProps) {
  const router = useRouter();
  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: DepositFormValues) {
    const { date, desc, from, to, currency, amount } = data;
    let result: number | DepositType | null;
    if (id) {
      result = await updateDeposit({
        id: id,
        date: date.toDateString(),
        desc,
        from,
        to,
        currency,
        amount,
      });
    } else {
      result = await addDeposit({
        date: date.toDateString(),
        desc,
        from,
        to,
        currency,
        amount,
      });
    }
    if (result) {
      toastDBSaveSuccess();
      router.push("/fund-transfer");
    } else {
      toastDBSaveError();
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select value" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DEPOSIT_TYPE.map(c => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-3">
            <FormField
              control={form.control}
              name="date"
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
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between gap-3">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>From</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select value" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FROM.map(c => (
                        <SelectItem key={c} value={c}>
                          {c}
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
              name="to"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>To</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select value" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FROM.map(c => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit">Save</Button>
            <Button type="button" variant="destructive" onClick={() => router.push("/mutual-fund")}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
