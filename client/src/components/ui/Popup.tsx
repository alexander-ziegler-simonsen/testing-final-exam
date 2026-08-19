import type { ReactNode } from "react";
import { Dialog, Portal } from "@chakra-ui/react";

interface PopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer: ReactNode;
  testId?: string;
}

// The dialog shell (backdrop, positioning, header/body/footer layout) with
// none of the "what's inside it" logic - that's up to whoever uses it.
export function Popup({ open, onOpenChange, title, children, footer, testId = "popup" }: PopupProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(details) => onOpenChange(details.open)} data-testid={testId}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content data-testid={`${testId}-content`}>
            <Dialog.Header>
              <Dialog.Title data-testid={`${testId}-title`}>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>{children}</Dialog.Body>
            <Dialog.Footer>{footer}</Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
