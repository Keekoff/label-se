
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("h-[350px] w-full", className)}
      {...props}
    />
  )
)
ChartContainer.displayName = "ChartContainer"

export const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-background p-2 shadow-sm",
      className
    )}
    {...props}
  />
))
ChartTooltip.displayName = "ChartTooltip"
