"use client";

import { ColumnDef } from "@tanstack/react-table";

import NumberFormater from "@/components/shared/number-format";
import { convertToExchangeType } from "@/lib/utils";
import { CompanyType } from "@/models/company.model";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const Columns: ColumnDef<CompanyType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Compay" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[250px] truncate font-medium">{row.getValue("name")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "sector",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Sector" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">{row.getValue("sector")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">{row.getValue("type")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "exchange",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Exchange" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">{row.getValue("exchange")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "currentPrice",
    header: ({ column }) => <DataTableColumnHeader column={column} title="CurrentPrice" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 w-20 flex-row-reverse">
          <span className="font-medium text-center">
            <NumberFormater value={row.getValue("currentPrice")} exchange={convertToExchangeType(row.original.exchange)} />
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
