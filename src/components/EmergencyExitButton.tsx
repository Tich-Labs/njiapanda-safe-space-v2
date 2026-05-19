import { X } from "lucide-react";
import { useEffect } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const handleExit = () => {
  sessionStorage.clear();
  localStorage.clear();
  window.location.replace("https://weather.com");
};

const EmergencyExitButton = () => {
  // Global Escape key listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Don't trigger if user is in a modal/dialog input
        const active = document.activeElement;
        const inDialog = active?.closest("[role='dialog']");
        if (!inDialog) {
          handleExit();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleExit}
          className="fixed bottom-24 right-4 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-emergency text-emergency-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 animate-pulse-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emergency focus-visible:ring-offset-2 focus-visible:ring-offset-card sm:h-auto sm:w-auto sm:gap-1.5 sm:rounded-full sm:px-4 sm:py-3"
          aria-label="Emergency exit — leave this page immediately"
        >
          <X className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:inline text-xs font-semibold">Exit</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={8}>
        Anonymous by default. You can leave anytime.
      </TooltipContent>
    </Tooltip>
  );
};

export default EmergencyExitButton;
