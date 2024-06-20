"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./data-table-column-header";
import { NumericFormat } from "react-number-format";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";
import { MutualFundInvestmentType } from "@/models/mutual-fund-investment.model";
import { Badge } from "@/components/ui/badge";

export const Columns: ColumnDef<MutualFundInvestmentType>[] = [
  {
    accessorKey: "mutualFund.name",
    id: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Mutual fund" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="font-medium">{row.getValue("name")}</span>
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
          <span className="w-16 text-right font-medium">{row.getValue("qty")}</span>
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
            <NumericFormat
              displayType="text"
              decimalScale={2}
              fixedDecimalScale
              thousandsGroupStyle="lakh"
              thousandSeparator=","
              value={row.getValue("price")}
            />
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
            <NumericFormat displayType="text" decimalScale={2} fixedDecimalScale thousandsGroupStyle="lakh" thousandSeparator="," value={amount} />
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "profit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Profit/Loss" />,
    cell: ({ row }) => {
      const purchaseValue = row.original.price * row.original.qty + row.original.stt + row.original.brokerage + row.original.otherCharges;
      const currentValue = (row.original.mutualFund?.currentPrice ?? 0) * row.original.qty;
      const pl = currentValue - purchaseValue;
      const percentage = (pl * 100) / purchaseValue;
      return (
        <div className="space-x-1">
          <span className="w-24 text-right font-medium">
            <Badge className="mr-1">{Math.round(percentage)}%</Badge>
            <NumericFormat displayType="text" decimalScale={2} fixedDecimalScale thousandsGroupStyle="lakh" thousandSeparator="," value={pl} />
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
