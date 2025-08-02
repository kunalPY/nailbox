import React from "react"
import * as RadioGroupPrimitives from "@radix-ui/react-radio-group"
import { cn } from "@/lib/utils"

const RadioCardGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitives.Root
      ref={ref}
      className={cn("grid gap-2", className)}
      {...props}
    />
  )
})
RadioCardGroup.displayName = "RadioCardGroup"

const RadioCardItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <RadioGroupPrimitives.Item
      ref={ref}
      className={cn(
        // Base styles
        "group relative w-full rounded-lg border p-4 text-left shadow-sm transition-all duration-200 focus:outline-none",
        // Background colors
        "bg-white dark:bg-gray-950",
        // Border colors - customized to dark yellow
        "border-gray-300 dark:border-gray-800",
        "data-[state=checked]:border-yellow-600 data-[state=checked]:ring-1 data-[state=checked]:ring-yellow-600",
        "dark:data-[state=checked]:border-yellow-600 dark:data-[state=checked]:ring-yellow-600",
        // Disabled states
        "data-[disabled]:border-gray-200 dark:data-[disabled]:border-gray-800",
        "data-[disabled]:bg-gray-50 data-[disabled]:shadow-none dark:data-[disabled]:bg-gray-900",
        "data-[disabled]:opacity-50",
        // Focus styles
        "focus-visible:ring-2 focus-visible:ring-yellow-600 focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    >
      {children}
    </RadioGroupPrimitives.Item>
  )
})
RadioCardItem.displayName = "RadioCardItem"

const RadioCardIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        // Base indicator styles
        "relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border shadow-sm",
        // Border and background - customized to yellow theme
        "border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-950",
        "group-data-[state=checked]:border-yellow-600 group-data-[state=checked]:bg-yellow-600",
        "dark:group-data-[state=checked]:border-yellow-600 dark:group-data-[state=checked]:bg-yellow-600",
        // Disabled states
        "group-data-[disabled]:border-gray-200 group-data-[disabled]:bg-gray-100",
        "dark:group-data-[disabled]:border-gray-800 dark:group-data-[disabled]:bg-gray-900",
        className,
      )}
      {...props}
    >
      {/* Inner dot when selected */}
      <div className="h-2 w-2 rounded-full bg-white opacity-0 transition-opacity group-data-[state=checked]:opacity-100" />
    </div>
  )
})
RadioCardIndicator.displayName = "RadioCardIndicator"

export { RadioCardGroup, RadioCardItem, RadioCardIndicator }