"use client"

import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(className)}
      classNames={{
        root:
          "relative flex w-full flex-col rounded-xl bg-white p-3 text-zinc-900 dark:bg-zinc-900 dark:text-white",
        months: "flex flex-col sm:flex-row gap-2 sm:gap-4",
        month: "flex flex-col gap-4",
        // header: arrows at top near month/year dropdowns
        month_caption:
          "relative flex min-h-9 items-center justify-center gap-2 border-b border-zinc-200 px-4 py-2 text-zinc-900 dark:border-zinc-800 dark:text-white",
        caption_label: "sr-only",
        dropdowns:
          "flex items-center justify-center gap-3 text-sm font-medium text-zinc-900 dark:text-white",
        dropdown:
          "bg-transparent text-zinc-900 focus-visible:outline-none focus-visible:ring-0 dark:bg-transparent dark:text-white dark:[color-scheme:dark]",
        dropdown_root:
          "relative z-20 text-zinc-900 dark:text-white dark:[&_option]:bg-zinc-800 dark:[&_option]:text-white",
        months_dropdown:
          "bg-transparent text-zinc-900 dark:bg-transparent dark:text-white dark:accent-zinc-400",
        years_dropdown:
          "bg-transparent text-zinc-900 dark:bg-transparent dark:text-white dark:accent-zinc-400",
        // prev/next at top near dropdowns; pointer-events-none allows dropdown clicks; buttons have pointer-events-auto
        nav: "pointer-events-none absolute top-3 left-1/2 flex h-9 w-64 -translate-x-1/2 items-center justify-between z-10",
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "size-7 rounded-full bg-transparent p-0 text-zinc-900 hover:bg-zinc-100 hover:text-zinc-900 dark:text-white dark:hover:bg-transparent dark:hover:text-white dark:[&_svg]:fill-white pointer-events-auto"
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "size-7 rounded-full bg-transparent p-0 text-zinc-900 hover:bg-zinc-100 hover:text-zinc-900 dark:text-white dark:hover:bg-transparent dark:hover:text-white dark:[&_svg]:fill-white pointer-events-auto"
        ),
        chevron: "size-3.5 shrink-0 text-zinc-900 fill-zinc-900 dark:text-white dark:fill-white",
        month_grid: "w-full border-collapse space-y-1 mt-2",
        weekdays: "flex",
        weekday: "text-zinc-500 rounded-md w-8 font-normal text-[0.8rem]",
        weeks: "flex flex-col gap-1 w-full",
        week: "flex w-full",
        day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 p-0 font-normal text-zinc-900 hover:bg-zinc-100 aria-selected:opacity-100 rounded-full dark:text-white dark:hover:bg-white/10"
        ),
        range_start: "day-range-start rounded-s-md bg-primary text-primary-foreground",
        range_end: "day-range-end rounded-e-md bg-primary text-primary-foreground",
        selected:
          "bg-zinc-200 text-zinc-900 hover:bg-zinc-200 hover:text-zinc-900 focus:bg-zinc-200 focus:text-zinc-900 rounded-full dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-700 dark:focus:bg-zinc-700",
        today: "bg-zinc-100 text-zinc-900 rounded-full dark:bg-zinc-800 dark:text-white",
        outside:
          "day-outside text-zinc-400 opacity-50 aria-selected:bg-zinc-200 aria-selected:text-zinc-900 aria-selected:opacity-100 dark:text-zinc-400 dark:aria-selected:bg-zinc-700 dark:aria-selected:text-white",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}

export { Calendar }
