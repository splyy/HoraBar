import * as RadixSelect from '@radix-ui/react-select';
import styles from './Select.module.css';

interface SelectProps {
  value: string | number;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  size?: 'sm' | 'base';
  disabled?: boolean;
  className?: string;
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = 'Sélectionner…',
  size = 'base',
  disabled,
  className,
}: SelectProps) {
  const sizeClass = size === 'sm' ? styles.sm : styles.base;

  return (
    <RadixSelect.Root
      value={String(value) || undefined}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <RadixSelect.Trigger
        className={`${styles.trigger} ${sizeClass} ${className ?? ''}`}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon className={styles.icon}>
          <ChevronIcon />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Content
        className={styles.content}
        position="popper"
        sideOffset={4}
        align="start"
      >
        <RadixSelect.Viewport className={styles.viewport}>
          {options.map((opt) => (
            <RadixSelect.Item
              key={opt.value}
              value={opt.value}
              className={styles.item}
            >
              <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
            </RadixSelect.Item>
          ))}
        </RadixSelect.Viewport>
      </RadixSelect.Content>
    </RadixSelect.Root>
  );
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
