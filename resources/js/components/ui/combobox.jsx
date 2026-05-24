"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

function Combobox({
  items = [],
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  className,
  disabled = false,
  itemToStringValue = (item) => String(item),
  itemToValue,
  triggerClassName,
  ...props
}) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const getItemLabel = React.useCallback(
    (item) => itemToStringValue(item),
    [itemToStringValue]
  )

  const getItemValue = React.useCallback(
    (item) => (itemToValue ? itemToValue(item) : itemToStringValue(item)),
    [itemToValue, itemToStringValue]
  )

  const filteredItems = React.useMemo(() => {
    if (!search) return items
    const searchLower = search.toLowerCase()
    return items.filter((item) =>
      getItemLabel(item).toLowerCase().includes(searchLower)
    )
  }, [items, search, getItemLabel])

  const selectedItem = React.useMemo(() => {
    return items.find((item) => {
      const itemValue = getItemValue(item)
      return itemValue === value || (typeof value === "object" && item === value)
    })
  }, [items, value, getItemValue])

  const handleSelect = (item) => {
    const itemValue = getItemValue(item)
    onValueChange?.(itemValue, item)
    setOpen(false)
    setSearch("")
  }

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", triggerClassName)}
            disabled={disabled}
          >
            {selectedItem ? getItemLabel(selectedItem) : placeholder}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start" sideOffset={4}>
        <div className="flex items-center border-b px-3">
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 border-0 focus-visible:ring-0 text-sm"
          />
        </div>
        <div className="max-h-[300px] overflow-auto p-1">
          {filteredItems.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {emptyText}
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const itemValue = getItemValue(item)
              const itemLabel = getItemLabel(item)
              const isSelected = itemValue === value || (typeof value === "object" && item === value)
              return (
                <div
                  key={index}
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    isSelected && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => handleSelect(item)}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {itemLabel}
                </div>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
    </div>
  )
}

export { Combobox }
