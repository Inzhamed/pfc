import * as React from "react"
import { cn } from "@/lib/utils"

const Select = ({ children, ...props }) => {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        props.className
      )}
    >
      {children}
    </select>
  )
}

const SelectTrigger = ({ children }) => <>{children}</>
const SelectValue = ({ placeholder }) => <option disabled selected>{placeholder}</option>
const SelectContent = ({ children }) => <>{children}</>
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}