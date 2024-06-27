"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { StockInvestmentType } from "@/models/stock-investment.model";
import { format } from "date-fns";
import { CustomNumericFormat } from "@/components/shared/number-format";

export const Columns: ColumnDef<StockInvestmentType>[] = [
  {
    accessorKey: "company.name",
    id: "name",
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
    accessorKey: "purchaseDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Purchase Date" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[250px] truncate font-medium">{format(row.getValue("purchaseDate"), "PP")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "qty",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="w-11 text-center font-medium">{row.getValue("qty")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-1">
          <span className="w-16 text-right font-medium">
            <CustomNumericFormat value={row.getValue("price")} />
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "netAmount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Net Amount" />,
    cell: ({ row }) => {
      const amount = row.original.price * row.original.qty + row.original.stt + row.original.brokerage + row.original.otherCharges;
      return (
        <div className="flex space-x-1">
          <span className="w-24 text-right font-medium">
            <CustomNumericFormat value={amount} />
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "broker",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Broker" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="font-medium">{row.getValue("broker")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
