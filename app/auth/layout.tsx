"use client";

import { ParticleBackground } from "@/components/ui/particle-background";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ParticleBackground />
      <div className="w-full max-w-md p-6 bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg">
        {children}
      </div>
    </div>
  );
}