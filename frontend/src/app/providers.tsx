import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <BrowserRouter>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </BrowserRouter>
  );
}
