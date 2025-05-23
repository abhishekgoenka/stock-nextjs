"use client";

import { Cross2Icon, PlusIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import Link from "next/link";

import { DEPOSIT, DEPOSIT_TYPE } from "@/lib/constants";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

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
  type: DEPOSIT;
}

export function DataTableToolbar<TData>({ table, type }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const CreateLink = () => {
    if (type === "Dividend") {
      return (
        <Link className="w-full" href="/dividend/create" rel="noopener noreferrer">
          Add Deposit
        </Link>
      );
    }
    return (
      <Link className="w-full" href="/fund-transfer/create" rel="noopener noreferrer">
        Add Deposit
      </Link>
    );
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter deposits..."
          value={(table.getColumn("desc")?.getFilterValue() as string) ?? ""}
          onChange={event => table.getColumn("desc")?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("desc") && <DataTableFacetedFilter column={table.getColumn("desc")} title="Deposit" options={DEPOSIT_TYPE} />}
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
        <CreateLink />
      </Button>
      <DataTableViewOptions table={table} />
    </div>
  );
}
