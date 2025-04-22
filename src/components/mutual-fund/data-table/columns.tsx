"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CustomNumericFormat } from "@/components/shared/number-format";
import { MutualFundType } from "@/models/mutual-fund.model";

import { DataTableColumnHeader } from "../../companies/data-table/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const Columns: ColumnDef<MutualFundType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Mutual Fund" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "equity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Equity" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <CustomNumericFormat className="font-medium" suffix={"%"} value={row.getValue("equity")} />
        </div>
      );
    },
  },
  {
    accessorKey: "debt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Debt" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <CustomNumericFormat className="font-medium" suffix={"%"} value={row.getValue("debt")} />
        </div>
      );
    },
  },
  {
    accessorKey: "others",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Others" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <CustomNumericFormat className="font-medium" suffix={"%"} value={row.getValue("others")} />
        </div>
      );
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
            <CustomNumericFormat value={row.getValue("currentPrice")} />
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
