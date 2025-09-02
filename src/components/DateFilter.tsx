"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function DateOrAllPicker({
  selection,
  setSelection,
  open,
  setOpen,
}: {
  selection: "all" | Date | undefined
  setSelection: (value: "all" | Date | undefined) => void
  open: boolean
  setOpen: (value: boolean) => void
}) {
  // Local select state just to force updates
  const [selectValue, setSelectValue] = React.useState("all")

  React.useEffect(() => {
    if (selection === "all") {
      setSelectValue("all")
    }
  }, [selection])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex items-center space-x-2">
        {/* Controlled Select */}
        <Select
          value={selectValue}
          onValueChange={(value) => {
            if (value === "all") {
              setSelection("all")
              setSelectValue("all")
              setOpen(false)
            }
          }}
        >
          <SelectTrigger className="w-[100px]">
            {selection === "all"
              ? "All"
              : selection
              ? "Date"
              : "Select"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>

        {/* Calendar Popover Trigger */}
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              selection === "all" && "text-muted-foreground"
            )}
          >
            {selection instanceof Date
              ? format(selection, "PPP")
              : "Select date"}
          </Button>
        </PopoverTrigger>
      </div>

      {/* Calendar in Popover */}
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selection instanceof Date ? selection : undefined}
          onSelect={(date) => {
            if (date) {
              setSelection(date)
              setSelectValue("") // Clear select value so "All" can be reselected
              setOpen(false)
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
