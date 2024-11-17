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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { type User } from "next-auth";

const expenseFormSchema = addExpenseSchema.pick({
  amount: true,
  description: true,
  splitWithUserId: true,
});

type ExpenseFormSchema = z.infer<typeof expenseFormSchema>;

type AddGroupExpenseDialogProps = {
  groupName: string;
  groupId: number;
  currentUser: User;
};

export default function AddGroupExpenseDialog({
  groupName,
  groupId,
}: AddGroupExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [isExpenseSubmitting, setIsExpenseSubmitting] = useState(false);
  const { toast } = useToast();
  const utils = api.useUtils();

  const users = api.group.getMembers.useSuspenseQuery({ id: groupId });

  const form = useForm<ExpenseFormSchema>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: "0",
      description: "",
      splitWithUserId: [],
    },
  });

  async function handleAddExpense(values: ExpenseFormSchema) {
    setIsExpenseSubmitting(true);

    const expense = await addExpense(
      groupId,
      values.amount,
      values.description,
      values.splitWithUserId,
    );

    if (expense?.id) {
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
            <FormField
              control={form.control}
              name="splitWithUserId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Split</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value.length > 0
                            ? `Split with ${field.value.length} users`
                            : "Select users"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search for users..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No users found.</CommandEmpty>
                          <CommandGroup>
                            {users[0].map((user) => (
                              <CommandItem
                                value={user.user?.id ?? ""}
                                key={user.user?.id ?? ""}
                                onSelect={() => {
                                  if (user.user?.id) {
                                    if (field.value.includes(user.user?.id)) {
                                      form.setValue(
                                        "splitWithUserId",
                                        field.value.filter(
                                          (id) => id !== user.user?.id,
                                        ),
                                      );
                                    } else {
                                      form.setValue("splitWithUserId", [
                                        ...field.value,
                                        user.user.id,
                                      ]);
                                    }
                                  }
                                }}
                              >
                                {user.user?.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    field.value.includes(user.user?.id ?? "")
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select the users to split this expense with.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
