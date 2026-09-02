import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { isAuthed } from "@/lib/auth";

/**
 * Frontend-only gate for the mock session. Logged-out visitors are sent to
 * /signup instead of seeing app pages.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (isAuthed()) setOk(true);
    else navigate({ to: "/signup", replace: true });
  }, [navigate]);

  if (!ok) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-rose-500" />
      </div>
    );
  }

  return <>{children}</>;
}
