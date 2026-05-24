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
import { cn } from '@/lib/utils';

export function ConfirmAlertDialog({
    open,
    onOpenChange,
    title,
    icon,
    children,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    confirmClassName,
    confirmDisabled = false,
}) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    {title && (
                        <AlertDialogTitle>
                            {icon ? (
                                <span className="inline-flex items-center gap-3">
                                    {icon}
                                    <span>{title}</span>
                                </span>
                            ) : (
                                title
                            )}
                        </AlertDialogTitle>
                    )}
                    {children && (
                        <AlertDialogDescription>{children}</AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction
                        className={cn(confirmClassName)}
                        onClick={onConfirm}
                        disabled={confirmDisabled}
                    >
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

