import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { LucideIcon } from "lucide-react";

interface SplitBadgeProps {
  leftContent?: string | ReactNode;
  icon?: React.ReactElement<LucideIcon>;
  children: ReactNode;
  size?: "sm" | "lg";
  className?: string;
  tooltip?: ReactNode;
}

export default function SplitBadge({ leftContent, icon, children, size = "sm", className, tooltip }: SplitBadgeProps) {
  if (!leftContent && !icon) {
    throw new Error("Either leftContent or icon must be provided");
  }

  const badge = (
    <div className={cn(
      "border border-border font-medium inline-flex justify-center items-center rounded text-muted-foreground leading-none h-full",
      size === "lg" ? "gap-1 pr-2" : "gap-0.5 pr-1",
      className
    )}>
      <span className={cn(
        "leading-none bg-muted text-muted-foreground flex items-center h-full",
        size === "lg" ? "text-base px-2 py-1 mr-1" : "text-xs px-1 py-0.5 mr-0.5"
      )}>
        {icon && React.cloneElement(icon, {
          className: cn("mr-1 h-full", size === "lg" ? "h-5 w-5" : "h-3 w-3"),
          size: size === "lg" ? 20 : 12,
          "aria-hidden": "true"
        } as React.SVGProps<SVGSVGElement>)}
        {leftContent}
      </span>
      {children}
    </div>
  );

  if (tooltip) {
    if (typeof tooltip === 'string') {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              {badge}
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              align="center"
              className="w-auto"
              sideOffset={5}
            >
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else {
      return (
        <HoverCard openDelay={50} closeDelay={50}>
          <HoverCardTrigger asChild>
            {badge}
          </HoverCardTrigger>
          <HoverCardContent
            side="bottom"
            align="center"
            className="w-auto"
            sideOffset={5}
          >
            {tooltip}
          </HoverCardContent>
        </HoverCard>
      );
    }
  }

  return badge;
}
