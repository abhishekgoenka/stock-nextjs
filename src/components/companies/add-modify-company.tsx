"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXCHANGE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toastDBSaveError, toastDBSaveSuccess } from "@/components/shared/toast-message";
import { addCompany, updateCompany } from "@/actions/company.service";
import { CompanyType } from "@/models/company.model";

const companyFormSchema = z.object({
  name: z.string().min(1),
  sector: z.string().min(4, "Select sector"),
  url: z.string().url(),
  type: z.string().min(4, "Select type"),
  exchange: z.string().min(3, "Select exchange"),
  symbol: z.string(),
  currentPrice: z.coerce.number(),
});

const sectors = [
  "Oil Exploration and Production",
  "Retailing",
  "Finance - NBFC",
  "Finance - Investment",
  "Footwear",
  "Speciality Chemicals",
  "Commodity Chemicals",
  "Pharmaceuticals & Drugs",
  "IT Services & Consulting",
  "Bank - Private",
  "Household & Personal Products",
  "Printing & Publishing",
  "Power Generation/Distribution",
  "Plastics - Tubes/Pipes/Hoses & Fittings",
  "Iron & Steel",
  "Pesticides & Agrochemicals",
  "Software",
  "Domestic Appliances",
  "ETF",
  "Technology",
  "Auto Manufacturers",
  "Internet Retail",
  "Internet Content & Information",
  "Consumer Electronics",
].sort();

export type CompanyFormValues = z.infer<typeof companyFormSchema>;
type AddModifyCompanyProps = {
  defaultValues: Partial<CompanyFormValues>;
  id?: number;
};

export default function AddModifyCompany({ defaultValues, id }: AddModifyCompanyProps) {
  const router = useRouter();
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: CompanyFormValues) {
    const { name, sector, url, type, exchange, symbol, currentPrice } = data;
    let result: number | CompanyType | null;
    if (id) {
      result = await updateCompany({
        id: id,
        name,
        sector,
        url,
        type,
        exchange,
        symbol,
        currentPrice,
      });
    } else {
      result = await addCompany({
        name,
        sector,
        url,
        type,
        exchange,
        symbol,
        currentPrice,
      });
    }
    if (result) {
      toastDBSaveSuccess();
      router.push("/companies");
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
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sector</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sectors.map(s => (
                      <SelectItem key={s} value={s}>
                        {s}
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Largecap">Largecap</SelectItem>
                    <SelectItem value="Midcap">Midcap</SelectItem>
                    <SelectItem value="Smallcap">Smallcap</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
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

            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="Symbol" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Save</Button>
        </form>
      </Form>
    </>
  );
}
