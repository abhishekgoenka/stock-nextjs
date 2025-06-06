"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteStockInvestment } from "@/actions/stock-investment.service";
import { DeleteConfirmation } from "@/components/shared/delete-confirmation";
import { toastDBDeleteSuccess, toastDBSaveError } from "@/components/shared/toast-message";
import StockInvestment from "@/models/stock-investment.model";

import { Button } from "../../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();
  const investment = row.original as StockInvestment;

  const deleteHandler = async (id: number) => {
    const result = await deleteStockInvestment(id);
    if (result) {
      toastDBDeleteSuccess();
      router.refresh();
    } else {
      toastDBSaveError();
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>
            <Link className="w-full" href={`/investments/stocks/edit/${investment?.id}`} rel="noopener noreferrer">
              Edit Investment
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link className="w-full" href={investment?.company?.url} rel="noopener noreferrer" target="_blank">
              Show detail
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowAlert(true)}>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmation open={showAlert} onCancel={() => setShowAlert(false)} onContinue={() => deleteHandler(investment?.id!)} />
    </>
  );
}
