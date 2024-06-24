"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../../ui/dropdown-menu";

import Link from "next/link";
import { toastDBDeleteSuccess, toastDBSaveError } from "@/components/shared/toast-message";
import { DeleteConfirmation } from "@/components/shared/delete-confirmation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DepositType } from "@/models/deposit.model";
import { deleteDeposit } from "@/actions/deposit.service";
import { DEPOSIT, DEPOSIT_DIVIDEND_RECEIVED } from "@/lib/constants";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();
  const deposit = row.original as DepositType;

  const deleteHandler = async (id: number) => {
    setShowAlert(false);
    const result = await deleteDeposit(id);
    if (result) {
      toastDBDeleteSuccess();
      router.refresh();
    } else {
      toastDBSaveError();
    }
  };

  const EditLink = () => {
    if (deposit.desc === DEPOSIT_DIVIDEND_RECEIVED) {
      return (
        <Link className="w-full" href={`/dividend/edit/${deposit?.id}`} rel="noopener noreferrer">
          Edit
        </Link>
      );
    }
    return (
      <Link className="w-full" href={`/fund-transfer/edit/${deposit?.id}`} rel="noopener noreferrer">
        Edit
      </Link>
    );
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
            <EditLink />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowAlert(true)}>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmation open={showAlert} onCancel={() => setShowAlert(false)} onContinue={() => deleteHandler(deposit?.id!)} />
    </>
  );
}
