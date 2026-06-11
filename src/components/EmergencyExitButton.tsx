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
          className="fixed top-4 right-4 z-[9999] flex items-center gap-2 rounded-full bg-emergency px-4 py-3 text-sm font-semibold text-emergency-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emergency focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          aria-label="Quick exit — leaves this page immediately"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Quick Exit
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={8}>
        Leave this page immediately.
      </TooltipContent>
    </Tooltip>
  );
};

export default EmergencyExitButton;
