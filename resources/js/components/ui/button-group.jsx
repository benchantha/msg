"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonGroupVariants = cva(
  "inline-flex items-center justify-center [&>*]:shrink-0",
  {
    variants: {
      orientation: {
        horizontal:
          "flex-row [&>*:first-child]:rounded-r-none [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:-ml-px [&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md [&>*:not(:first-child):not(:last-child)]:rounded-none",
        vertical:
          "flex-col [&>*:first-child]:rounded-b-none [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:-mt-px [&>*:first-child]:rounded-t-md [&>*:last-child]:rounded-b-md [&>*:not(:first-child):not(:last-child)]:rounded-none",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

function ButtonGroup({
  className,
  orientation = "horizontal",
  ...props
}) {
  return (
    <div
      data-slot="button-group"
      role="group"
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

const buttonGroupSeparatorVariants = cva("shrink-0 bg-border", {
  variants: {
    orientation: {
      horizontal: "h-6 w-px",
      vertical: "h-px w-6",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}) {
  return (
    <div
      data-slot="button-group-separator"
      role="separator"
      aria-orientation={orientation}
      className={cn(buttonGroupSeparatorVariants({ orientation }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span"
  return (
    <Comp
      data-slot="button-group-text"
      className={cn(
        "text-muted-foreground inline-flex items-center px-3 text-sm",
        className
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
  buttonGroupSeparatorVariants,
}
