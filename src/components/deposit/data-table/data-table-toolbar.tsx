"use client";

import { Cross2Icon, PlusIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import Link from "next/link";

const depositType = [
  {
    value: "Fund Transfered",
    label: "Transfered",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "Fund Refund",
    label: "Refund",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "Divident Received",
    label: "Divident",
    icon: QuestionMarkCircledIcon,
  },
];

const currency = [
  {
    value: "INR",
    label: "INR",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "USD",
    label: "USD",
    icon: QuestionMarkCircledIcon,
  },
];

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter deposits..."
          value={(table.getColumn("desc")?.getFilterValue() as string) ?? ""}
          onChange={event => table.getColumn("desc")?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("desc") && <DataTableFacetedFilter column={table.getColumn("desc")} title="Deposit" options={depositType} />}
        {table.getColumn("currency") && <DataTableFacetedFilter column={table.getColumn("currency")} title="Currency" options={currency} />}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <Button variant="default" size="sm" className="hidden h-8 lg:flex ml-auto mr-2">
        <PlusIcon className="mr-2 h-4 w-4" />
        <Link className="w-full" href="/companies/create" rel="noopener noreferrer">
          Add Deposit
        </Link>
      </Button>
      <DataTableViewOptions table={table} />
    </div>
  );
}
