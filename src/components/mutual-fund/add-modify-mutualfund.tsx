"use client";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { addMF, updateMF } from "@/actions/mutual-fund.service";
import { toastDBSaveError, toastDBSaveSuccess } from "@/components/shared/toast-message";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXCHANGE } from "@/lib/constants";
import { MutualFundType } from "@/models/mutual-fund.model";

import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const mutualFundFormSchema = z.object({
  name: z.string().min(1),
  equity: z.coerce.number(),
  debt: z.coerce.number(),
  others: z.coerce.number(),
  largeCap: z.coerce.number(),
  midCap: z.coerce.number(),
  smallCap: z.coerce.number(),
  otherCap: z.coerce.number(),
  url: z.string().url(),
  exchange: z.string().min(3, "Select exchange"),
  symbol: z.string(),
  currentPrice: z.coerce.number(),
  indexFund: z.boolean(),
});

export type MutualFundFormValues = z.infer<typeof mutualFundFormSchema>;
type AddModifyMutualFundProps = {
  defaultValues: Partial<MutualFundFormValues>;
  id?: number;
};

export default function AddModifyMutualFund({ defaultValues, id }: AddModifyMutualFundProps) {
  const router = useRouter();
  const form = useForm<MutualFundFormValues>({
    resolver: zodResolver(mutualFundFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: MutualFundFormValues) {
    const { name, equity, debt, others, largeCap, midCap, smallCap, otherCap, url, exchange, symbol, currentPrice, indexFund } = data;
    let result: number | MutualFundType | null;
    if (id) {
      result = await updateMF({
        id: id,
        name,
        equity,
        debt,
        others,
        largeCap,
        midCap,
        smallCap,
        otherCap,
        url,
        exchange,
        symbol,
        currentPrice,
        indexFund,
      });
    } else {
      result = await addMF({
        name,
        equity,
        debt,
        others,
        largeCap,
        midCap,
        smallCap,
        otherCap,
        url,
        exchange,
        symbol,
        currentPrice,
        indexFund,
      });
    }
    if (result) {
      toastDBSaveSuccess();
      router.push("/mutual-fund");
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mutual fund</FormLabel>
                <FormControl>
                  <Input placeholder="Mutual fund name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mutual fund</FormLabel>
                <FormControl>
                  <Input placeholder="URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="exchange"
              render={({ field }) => (
                <FormItem className="w-1/3">
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

            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormLabel>
                    Symbol{" "}
                    <Link className="w-full" href="https://www.mfapi.in/" rel="noopener noreferrer" target="_blank">
                      <FontAwesomeIcon icon={faCircleInfo} />
                    </Link>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Symbol" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="indexFund"
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormLabel>Index fund</FormLabel>
                  <FormControl>
                    <Switch className="block !mt-4" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Tabs defaultValue="equity">
            <TabsList className="w-full">
              <TabsTrigger className="w-1/3" value="equity">
                Equity
              </TabsTrigger>
              <TabsTrigger className="w-1/3" value="debt">
                Debt
              </TabsTrigger>
              <TabsTrigger className="w-1/3" value="other">
                Other
              </TabsTrigger>
            </TabsList>
            <TabsContent value="equity">
              <FormField
                control={form.control}
                name="equity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Equity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 mt-3">
                <FormField
                  control={form.control}
                  name="largeCap"
                  render={({ field }) => (
                    <FormItem className="w-1/4">
                      <FormLabel>Large cap</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Large cap" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="midCap"
                  render={({ field }) => (
                    <FormItem className="w-1/4">
                      <FormLabel>Mid cap</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Mid cap" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smallCap"
                  render={({ field }) => (
                    <FormItem className="w-1/4">
                      <FormLabel>Small cap</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Small cap" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otherCap"
                  render={({ field }) => (
                    <FormItem className="w-1/4">
                      <FormLabel>other</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Other" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            <TabsContent value="debt">
              <FormField
                control={form.control}
                name="debt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Debt</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Debt" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent value="other">
              <FormField
                control={form.control}
                name="others"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Other" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>

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
