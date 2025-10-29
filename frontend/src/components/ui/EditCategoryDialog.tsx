import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define the props for the edit category dialog
interface EditCategoryDialogProps {
  /** The content for the dialog title */
  title: string;
  /** The content for the dialog description */
  dialogDescription: string; // Renamed to avoid conflict with form field
  /** The default value for the name input */
  defaultName?: string;
  /** The default value for the description input */
  defaultDescription?: string;
  /** The React node that will trigger the dialog (e.g., a Button) */
  trigger: React.ReactNode;
  /** Callback function that receives the form data on submission */
  onSave: (data: { name: string; description: string }) => void;
}

/**
 * A reusable dialog component for editing a category's name and description.
 * Based on the InputDialog component.
 */
export default function EditCategoryDialog({
  title,
  dialogDescription,
  defaultName = "",
  defaultDescription = "",
  trigger,
  onSave,
}: EditCategoryDialogProps) {
  // Control the open/closed state of the dialog
  const [open, setOpen] = useState(false);

  // Use simple state to manage the input values
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState(defaultDescription);

  // Handle the form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Call the parent's callback function with the data from state
    onSave({ name, description });
    // Close the dialog after saving
    setOpen(false);
  };

  // Handle the dialog's open/close state change
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    // If the dialog is opening, reset the form to its default values
    if (isOpen) {
      setName(defaultName);
      setDescription(defaultDescription);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {/* The form element wraps the dialog content */}
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                name="name"
                // Use value and onChange to make this a controlled component
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="category-description">Description</Label>
              <Input
                id="category-description"
                name="description"
                // Use value and onChange to make this a controlled component
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            {/* DialogClose will close the dialog without submitting */}
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            {/* This button submits the form */}
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
