"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { SpinnerGapIcon, TrashIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { deleteProjectAction } from "../_actions/delete-project.action";

export function DeleteProjectButton({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProjectAction({ projectId });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setOpen(false);
      router.push("/projects");
      router.refresh();
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="lg"
          className="w-fit rounded-lg"
          disabled={isPending}
        >
          <TrashIcon aria-hidden="true" weight="bold" />
          Delete project
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <TrashIcon aria-hidden="true" className="size-6" weight="fill" />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete {projectName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes the project and all of its deployments, and
            removes the cloned repository folder from the server. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel size="lg" disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            size="lg"
            className="bg-destructive "
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <SpinnerGapIcon
                aria-hidden="true"
                weight="bold"
                className="animate-spin"
              />
            ) : (
              <TrashIcon aria-hidden="true" weight="bold" />
            )}
            {isPending ? "Deleting…" : "Delete project"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
