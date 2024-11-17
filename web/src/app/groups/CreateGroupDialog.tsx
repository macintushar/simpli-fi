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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { createGroupSchema } from "@/server/api/routers/schemas";
import { type z } from "zod";
import { Input } from "@/components/ui/input";

export default function CreateGroupDialog() {
  const [open, setOpen] = useState(false);

  const utils = api.useUtils();
  const createGroup = api.group.createGroup.useMutation();

  const form = useForm<z.infer<typeof createGroupSchema>>({
    resolver: zodResolver(createGroupSchema),
  });

  async function onSubmit(data: z.infer<typeof createGroupSchema>) {
    createGroup.mutate(data);
    await utils.group.getGroups.invalidate();
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>+ Create Group</Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create A New Group</DialogTitle>
          <DialogDescription>
            Create a new group to track your expenses and members.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Trip 🛫🏝️" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" type="submit">
                Create Group
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
