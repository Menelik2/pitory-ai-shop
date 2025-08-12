import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scroll to top on route changes
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If navigating to an anchor on the same page, let the browser handle it
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
