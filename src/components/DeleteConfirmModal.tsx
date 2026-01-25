import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Destroy Evidence?",
  description = "This record will be permanently erased from your scrapbook. This action cannot be undone.",
}: DeleteConfirmModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="delete-confirm-modal">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-horror text-2xl text-center">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="font-display text-sm text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row justify-center gap-4 sm:justify-center">
          <AlertDialogCancel className="delete-modal-cancel">
            Keep It
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="delete-modal-confirm">
            Delete Forever
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
