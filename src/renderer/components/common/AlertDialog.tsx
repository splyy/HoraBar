import type { ReactNode } from 'react';
import * as RadixAlertDialog from '@radix-ui/react-alert-dialog';
import styles from './AlertDialog.module.css';

interface AlertDialogProps {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  variant?: 'danger' | 'default';
}

export function AlertDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Supprimer',
  cancelLabel = 'Annuler',
  onConfirm,
  variant = 'default',
}: AlertDialogProps) {
  return (
    <RadixAlertDialog.Root>
      <RadixAlertDialog.Trigger asChild>
        {trigger}
      </RadixAlertDialog.Trigger>

      <RadixAlertDialog.Overlay className={styles.overlay} />
      <RadixAlertDialog.Content className={styles.content}>
        <RadixAlertDialog.Title className={styles.title}>
          {title}
        </RadixAlertDialog.Title>
        <RadixAlertDialog.Description className={styles.description}>
          {description}
        </RadixAlertDialog.Description>

        <div className={styles.actions}>
          <RadixAlertDialog.Cancel asChild>
            <button className={styles.cancelBtn}>{cancelLabel}</button>
          </RadixAlertDialog.Cancel>
          <RadixAlertDialog.Action asChild>
            <button
              className={`${styles.confirmBtn} ${variant === 'danger' ? styles.danger : ''}`}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </RadixAlertDialog.Action>
        </div>
      </RadixAlertDialog.Content>
    </RadixAlertDialog.Root>
  );
}
