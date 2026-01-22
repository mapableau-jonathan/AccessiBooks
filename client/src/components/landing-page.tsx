"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Headphones, BookOpen, Accessibility, Moon, Play } from "lucide-react";
import { SiGoogle, SiGithub } from "react-icons/si";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Headphones className="h-8 w-8 text-amber-600" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">AccessiBooks</span>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => signIn()}>
            Sign In
          </Button>
          <Button onClick={() => signIn()}>
            Get Started
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Audiobooks for{" "}
            <span className="text-amber-600">Everyone</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            An accessible audiobook player with high contrast mode, dyslexia-friendly fonts, 
            keyboard navigation, and thousands of free public domain books.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => signIn("google")}
            >
              <SiGoogle className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8"
              onClick={() => signIn("github")}
            >
              <SiGithub className="mr-2 h-5 w-5" />
              Continue with GitHub
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <FeatureCard
              icon={<BookOpen className="h-8 w-8" />}
              title="90+ Free Books"
              description="Access audiobooks from LibriVox, Open Library, Google Books, and more."
            />
            <FeatureCard
              icon={<Accessibility className="h-8 w-8" />}
              title="Fully Accessible"
              description="High contrast mode, dyslexia fonts, screen reader support, and keyboard shortcuts."
            />
            <FeatureCard
              icon={<Play className="h-8 w-8" />}
              title="Seamless Playback"
              description="Persistent mini-player, sleep timer, bookmarks, and variable speed control."
            />
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-8 text-center text-gray-500">
        <p>Free audiobooks from the public domain. Premium features available.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="text-amber-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
