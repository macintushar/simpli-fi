"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

type AddGroupExpenseDialogProps = {
  groupName: string;
};

export default function AddGroupExpenseDialog({
  groupName,
}: AddGroupExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>+ Add Expense</Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add an Expense</DialogTitle>
          <DialogDescription>
            Add an expense to{" "}
            <span className="font-semibold text-neutral-900 dark:text-neutral-300">
              {groupName}
            </span>
            .
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={() => setOpen(false)}>
            Add to Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
