"use client";

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { getDashboardActivity } from '@/lib/supabase/dashboard';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { formatDistanceToNow } from 'date-fns';

export function DashboardActivity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadActivity() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await getDashboardActivity(session.user.id);
      if (data) {
        setActivities(data);
      }
      setLoading(false);
    }

    loadActivity();
  }, []);

  if (loading) {
    return (
      <Card className="p-6 bg-black/20 backdrop-blur-xl border border-white/10">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-gray-700 rounded"></div>
                  <div className="h-3 w-24 bg-gray-700 rounded"></div>
                </div>
              </div>
              <div className="h-6 w-16 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-black/20 backdrop-blur-xl border border-white/10">
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm">
                  {activity.action} <span className="text-cyan-400">{activity.problem_title}</span>
                </p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            <Badge
              variant={
                activity.difficulty === "Easy"
                  ? "default"
                  : activity.difficulty === "Medium"
                  ? "secondary"
                  : "destructive"
              }
            >
              {activity.difficulty}
            </Badge>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-gray-400 text-center">No recent activity</p>
        )}
      </div>
    </Card>
  );
}