"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { addExpenseSchema } from "@/server/api/routers/schemas";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { addExpense } from "./actions";
import { api } from "@/trpc/react";

type AddGroupExpenseDialogProps = {
  groupName: string;
  groupId: number;
};

const expenseFormSchema = addExpenseSchema.pick({
  amount: true,
  description: true,
});

type ExpenseFormSchema = z.infer<typeof expenseFormSchema>;

export default function AddGroupExpenseDialog({
  groupName,
  groupId,
}: AddGroupExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [isExpenseSubmitting, setIsExpenseSubmitting] = useState(false);
  const { toast } = useToast();
  const utils = api.useUtils();

  const form = useForm<ExpenseFormSchema>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: "0",
      description: "",
    },
  });

  async function handleAddExpense(values: ExpenseFormSchema) {
    setIsExpenseSubmitting(true);

    const expense = await addExpense(
      groupId,
      values.amount,
      values.description,
    );

    if (expense?.[0]?.id) {
      toast({
        title: `Added expense to ${groupName}.`,
        description: `Expense of ${values.amount} has been added to ${groupName}.`,
      });
      setIsExpenseSubmitting(false);
      await utils.group.getExpenses.invalidate({ id: groupId });
      setOpen(false);
    }
    setIsExpenseSubmitting(false);
  }

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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddExpense)}
            className="space-y-4"
          >
            <>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Food" {...field} />
                    </FormControl>
                    <FormDescription>
                      Add a description for your expense.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="0" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
            <DialogFooter>
              <Button
                variant="outline"
                size="default"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="default"
                type="submit"
                isLoading={isExpenseSubmitting}
                loadingText="Adding Expense..."
              >
                Add to Group
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
