"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { DepositType } from "@/models/deposit.model";
import { format } from "date-fns";
import NumberFormater from "@/components/shared/number-format";

export const Columns: ColumnDef<DepositType>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="font-medium">{format(row.getValue("date"), "PP")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "desc",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="font-medium">{row.getValue("desc")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "from",
    header: ({ column }) => <DataTableColumnHeader column={column} title="From" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="font-medium">{row.getValue("from")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "to",
    header: ({ column }) => <DataTableColumnHeader column={column} title="To" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="font-medium">{row.getValue("to")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "currency",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Currency" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="font-medium">{row.getValue("currency")}</span>
        </div>
      );
    },

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-1">
          <span className="w-24 text-right font-medium">
            <NumberFormater value={row.getValue("amount")} currency={row.original.currency} />
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
