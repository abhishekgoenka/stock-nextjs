"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Input } from "../../ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter mutual fund..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={event => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <Button variant="default" size="sm" className="hidden h-8 lg:flex ml-auto mr-2">
        <PlusIcon className="mr-2 h-4 w-4" />
        <Link className="w-full" href="/mutual-fund/create" rel="noopener noreferrer">
          Add Mutual Fund
        </Link>
      </Button>
      <DataTableViewOptions table={table} />
    </div>
  );
}
