"use client";

import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import Link from "next/link";

import { BROKERS } from "@/lib/constants";

import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

const brokerTypes = BROKERS;

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter mutual funds..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={event => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("broker") && <DataTableFacetedFilter column={table.getColumn("broker")} title="Broker" options={brokerTypes} />}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <Button variant="default" size="sm" className="hidden h-8 lg:flex ml-auto mr-2">
        <PlusIcon className="mr-2 h-4 w-4" />
        <Link className="w-full" href="/investments/mutual-fund/create" rel="noopener noreferrer">
          Buy Mutual Fund
        </Link>
      </Button>
      <DataTableViewOptions table={table} />
    </div>
  );
}
