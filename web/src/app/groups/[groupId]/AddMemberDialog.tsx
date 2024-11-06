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

type AddMemeberDialogProps = {
  groupId: number;
};

export default function AddMemeberDialog({ groupId }: AddMemeberDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button className="w-full" onClick={() => setOpen(true)}>
        + Add Member
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Member</DialogTitle>
          <DialogDescription>
            Invite someone to join this group.
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
