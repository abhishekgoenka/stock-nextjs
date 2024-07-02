"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENCY, DEPOSIT, DEPOSIT_TYPE, EXCHANGE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toastDBSaveError, toastDBSaveSuccess } from "@/components/shared/toast-message";
import { addDeposit, updateDeposit } from "@/actions/deposit.service";
import { DepositType } from "@/models/deposit.model";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { AnnualReturnType } from "@/models/annual-return.model";
import { addAnnualReturn, updateAnnualReturn } from "@/actions/annual-return.service";

const YEARS = ["2020", "2021", "2022", "2023", "2024"];
const annualReturnFormSchema = z.object({
  year: z.string().min(3, "Select year"),
  investments: z.coerce.number(),
  expectedReturn: z.coerce.number(),
  actualReturn: z.coerce.number(),
  actualReturnPercentage: z.coerce.number(),
  indexReturn: z.coerce.number(),
  exchange: z.string().min(3, "Select exchange"),
});

export type AnnualReturnFormValues = z.infer<typeof annualReturnFormSchema>;
type AddModifyAnnualReturnProps = {
  defaultValues: Partial<AnnualReturnFormValues>;
  id?: number;
};

export default function AddModifyAnnualReturn({ defaultValues, id }: AddModifyAnnualReturnProps) {
  const router = useRouter();
  const form = useForm<AnnualReturnFormValues>({
    resolver: zodResolver(annualReturnFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: AnnualReturnFormValues) {
    const { year, investments, expectedReturn, actualReturn, actualReturnPercentage, indexReturn, exchange } = data;
    let result: number | AnnualReturnType | null;
    if (id) {
      result = await updateAnnualReturn({
        id: id,
        year: +year,
        investments,
        expectedReturn,
        actualReturn,
        actualReturnPercentage,
        indexReturn,
        exchange,
      });
    } else {
      result = await addAnnualReturn({
        year: +year,
        investments,
        expectedReturn,
        actualReturn,
        actualReturnPercentage,
        indexReturn,
        exchange,
      });
    }
    if (result) {
      toastDBSaveSuccess();
      router.push("/reports");
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
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select value" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {YEARS.map(c => (
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

          <div className="flex justify-between gap-3">
            <FormField
              control={form.control}
              name="investments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investments</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expectedReturn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected return</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actualReturn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actual return</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between gap-3">
            <FormField
              control={form.control}
              name="actualReturnPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Return percentage</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="indexReturn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Index Return</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exchange"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Exchange</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exchange" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EXCHANGE.map(e => (
                        <SelectItem key={e.label} value={e.value}>
                          {e.label}
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
            <Button type="button" variant="destructive" onClick={() => router.push("/reports")}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
