"use client";

import { Card } from "@/components/ui/card";
import { Code, Star, Trophy } from "lucide-react";

export function DashboardStats() {
  const stats = [
    { label: "Problems Solved", value: "42", icon: Code },
    { label: "Current Streak", value: "7 days", icon: Star },
    { label: "Achievement Points", value: "1,250", icon: Trophy },
  ];

  return (
    <Card className="p-6 bg-black/20 backdrop-blur-xl border border-white/10">
      <h2 className="text-xl font-bold mb-4">Your Stats</h2>
      <div className="grid gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <stat.icon className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-lg font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}