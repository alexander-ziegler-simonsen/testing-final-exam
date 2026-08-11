"use client"

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react"
import { LuX } from "react-icons/lu"

const SUCCESS_DURATION_MS = 8000

const baseToaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
})

export const toaster: typeof baseToaster = {
  ...baseToaster,
  // Errors stay open until the user dismisses them via the close button;
  // success toasts auto-dismiss after 8s. Other types keep their defaults.
  create: (options) =>
    baseToaster.create({
      ...options,
      duration:
        options.duration ??
        (options.type === "error" ? Infinity : options.type === "success" ? SUCCESS_DURATION_MS : undefined),
    }),
}

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root width={{ md: "sm" }} data-testid={`toast-${toast.type}`}>
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title data-testid="toast-title">{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description data-testid="toast-description">{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger data-testid="toast-action-button">{toast.action.label}</Toast.ActionTrigger>
            )}
            {(toast.closable ?? true) && (
              <Toast.CloseTrigger data-testid="toast-close-button">
                <LuX />
              </Toast.CloseTrigger>
            )}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
