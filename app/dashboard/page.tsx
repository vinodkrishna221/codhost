"use client";

import { DashboardWelcome } from "@/components/dashboard/welcome";
import { DashboardStats } from "@/components/dashboard/stats";
import { DashboardActivity } from "@/components/dashboard/activity";
import { DashboardRecommendations } from "@/components/dashboard/recommendations";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardWelcome />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardStats />
        <DashboardActivity />
      </div>
      <DashboardRecommendations />
    </div>
  );
}