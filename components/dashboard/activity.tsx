"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

export function DashboardActivity() {
  const activities = [
    {
      action: "Solved",
      problem: "Two Sum",
      time: "2 hours ago",
      difficulty: "Easy",
    },
    {
      action: "Attempted",
      problem: "Binary Tree Level Order",
      time: "5 hours ago",
      difficulty: "Medium",
    },
    {
      action: "Reviewed",
      problem: "Merge K Sorted Lists",
      time: "1 day ago",
      difficulty: "Hard",
    },
  ];

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
                  {activity.action} <span className="text-cyan-400">{activity.problem}</span>
                </p>
                <p className="text-xs text-gray-400">{activity.time}</p>
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
      </div>
    </Card>
  );
}