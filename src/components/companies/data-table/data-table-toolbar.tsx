"use client";

import { Cross2Icon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

const stockTypes = [
  {
    value: "Largecap",
    label: "Largecap",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "Midcap",
    label: "Midcap",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "Smallcap",
    label: "Smallcap",
    icon: QuestionMarkCircledIcon,
  },
];

const exchange = [
  {
    value: "NASDAQ",
    label: "NASDAQ",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "NSE",
    label: "NSE",
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
          placeholder="Filter companies..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={event => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("type") && <DataTableFacetedFilter column={table.getColumn("type")} title="Type" options={stockTypes} />}
        {table.getColumn("exchange") && <DataTableFacetedFilter column={table.getColumn("exchange")} title="Exchange" options={exchange} />}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
