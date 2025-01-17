"use client";

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Code, Star, Trophy } from "lucide-react";
import { getDashboardStats } from '@/lib/supabase/dashboard';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function DashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadStats() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await getDashboardStats(session.user.id);
      if (data) {
        setStats(data);
      }
      setLoading(false);
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <Card className="p-6 bg-black/20 backdrop-blur-xl border border-white/10">
        <h2 className="text-xl font-bold mb-4">Your Stats</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-700 rounded"></div>
                <div className="h-6 w-16 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const statItems = [
    { label: "Problems Solved", value: stats?.problems_solved || "0", icon: Code },
    { label: "Current Streak", value: `${stats?.current_streak || "0"} days`, icon: Star },
    { label: "Achievement Points", value: stats?.achievement_points?.toLocaleString() || "0", icon: Trophy },
  ];

  return (
    <Card className="p-6 bg-black/20 backdrop-blur-xl border border-white/10">
      <h2 className="text-xl font-bold mb-4">Your Stats</h2>
      <div className="grid gap-4">
        {statItems.map((stat, index) => (
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