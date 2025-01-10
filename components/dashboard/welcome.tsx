"use client";

import { Card } from "@/components/ui/card";

export function DashboardWelcome() {
  return (
    <Card className="p-6 bg-black/20 backdrop-blur-xl border border-white/10">
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
        Welcome Back
      </h1>
      <p className="text-gray-400 mt-2">
        Track your progress and continue your coding journey.
      </p>
    </Card>
  );
}