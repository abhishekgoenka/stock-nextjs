"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./data-table-column-header";
import Company from "@/models/company.model";
import { NumericFormat } from "react-number-format";
import { DataTableRowActions } from "./data-table-row-actions";
import StockInvestment from "@/models/stock-investment.model";
import { format } from "date-fns";

export const Columns: ColumnDef<StockInvestment>[] = [
  {
    accessorKey: "company.name",
    id: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Compay" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[250px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "purchaseDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purchase Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[250px] truncate font-medium">
            {format(row.getValue("purchaseDate"), "PP")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "qty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="w-11 text-center font-medium">
            {row.getValue("qty")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Net Amount" />
    ),
    cell: ({ row }) => {
      const amount =
        row.original.price * row.original.qty +
        row.original.stt +
        row.original.brokerage +
        row.original.otherCharges;
      return (
        <div className="flex space-x-1">
          <span className="w-24 text-right font-medium">
            <NumericFormat
              displayType="text"
              decimalScale={2}
              fixedDecimalScale
              thousandsGroupStyle="lakh"
              thousandSeparator=","
              value={amount}
            />
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "broker",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Broker" />
    ),
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
  // {
  //   accessorKey: "sector",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Sector" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-[200px] truncate font-medium">
  //           {row.getValue("sector")}
  //         </span>
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "type",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Type" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-[200px] truncate font-medium">
  //           {row.getValue("type")}
  //         </span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  // {
  //   accessorKey: "exchange",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Exchange" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-[200px] truncate font-medium">
  //           {row.getValue("exchange")}
  //         </span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  // {
  //   accessorKey: "currentPrice",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="CurrentPrice" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2 w-20 flex-row-reverse">
  //         <span className="font-medium text-center">
  //           <NumericFormat
  //             displayType="text"
  //             decimalScale={2}
  //             fixedDecimalScale
  //             thousandsGroupStyle="lakh"
  //             thousandSeparator=","
  //             value={row.getValue("currentPrice")}
  //           />
  //         </span>
  //       </div>
  //     );
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
