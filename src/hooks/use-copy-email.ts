import { useCallback } from "react";
import { toast } from "sonner";
import { EMAIL } from "@/lib/site";

export function useCopyEmail() {
  return useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      toast.success("Email copied", { description: EMAIL });
    } catch {
      // Clipboard can be blocked (insecure context, permissions); open mail instead.
      window.location.href = `mailto:${EMAIL}`;
    }
  }, []);
}
