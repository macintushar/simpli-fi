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
import { api } from "@/trpc/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "@/server/auth";
// import { useToast } from "@/hooks/use-toast";

type AddGroupExpenseDialogProps = {
  groupName: string;
  groupId: number;
};

export default function AddGroupExpenseDialog({
  groupName,
  groupId,
}: AddGroupExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  // const { toast } = useToast();

  const form = useForm<z.infer<typeof addExpenseSchema>>({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      amount: 0,
      description: "",
    },
  });

  async function handleAddExpense(
    values: Omit<Omit<z.infer<typeof addExpenseSchema>, "groupId">, "paidById">,
  ) {
    const addExpense = api.expense.addExpense.useMutation();
    const session = await auth();

    if (session?.user) {
      await addExpense.mutateAsync({
        groupId: groupId,
        amount: values.amount,
        description: values.description,
        paidById: session?.user.id,
      });
      // toast({
      //   title: "Expense Added",
      //   description: `Expense of ${values.amount} has been added to the ${groupName}.`,
      // });
    }
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
                size="lg"
                type="submit"
                // onClick={() => setOpen(false)}
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
