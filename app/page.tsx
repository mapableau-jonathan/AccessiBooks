"use client";

import { useSession } from "next-auth/react";
import { LandingPage } from "../client/src/components/landing-page";
import { LibraryPage } from "./library-page";

export default function HomePage() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!session) {
    return <LandingPage />;
  }
  
  return <LibraryPage />;
}
