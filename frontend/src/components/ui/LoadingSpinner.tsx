import * as React from "react";
import { Loader2 } from "lucide-react"; // A great spinner icon
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils"; // Your 'cn' utility

const spinnerVariants = cva(
  "animate-spin text-blue-600", // Base styles: spin animation and color
  {
    variants: {
      size: {
        default: "h-6 w-6",
        sm: "h-4 w-4",
        lg: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

const LoadingSpinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <Loader2
        ref={ref}
        className={cn(spinnerVariants({ size, className }))}
        {...props}
      />
    );
  }
);
LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner, spinnerVariants };
