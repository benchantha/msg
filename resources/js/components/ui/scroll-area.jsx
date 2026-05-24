"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function ScrollArea({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "relative max-h-[calc(100vh-8rem)] overflow-y-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

