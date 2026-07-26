"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DepartmentDeleteDialogProps {
  readonly isOpen: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly departmentName: string;
  readonly onConfirm: () => void;
}

export function DepartmentDeleteDialog({
  isOpen,
  onOpenChange,
  departmentName,
  onConfirm,
}: DepartmentDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Department</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the department <span className="font-bold text-foreground">{departmentName}</span>? This action is irreversible. All associated employees will be left without an assigned department.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}