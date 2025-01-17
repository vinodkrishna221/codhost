"use client";

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getRecommendedProblems } from '@/lib/supabase/dashboard';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function DashboardRecommendations() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadRecommendations() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await getRecommendedProblems(session.user.id);
      if (data) {
        setProblems(data);
      }
      setLoading(false);
    }

    loadRecommendations();
  }, []);

  if (loading) {
    return (
      <Card className="p-6 bg-black/20 backdrop-blur-xl border border-white/10">
        <h2 className="text-xl font-bold mb-4">Recommended Problems</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 rounded-lg bg-black/20">
              <div className="flex items-center justify-between mb-2">
                <div className="h-6 w-48 bg-gray-700 rounded"></div>
                <div className="h-6 w-16 bg-gray-700 rounded"></div>
              </div>
              <div className="h-4 w-full bg-gray-700 rounded mb-2"></div>
              <div className="h-6 w-24 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-black/20 backdrop-blur-xl border border-white/10">
      <h2 className="text-xl font-bold mb-4">Recommended Problems</h2>
      <div className="grid gap-4">
        {problems.map((problem, index) => (
          <div key={index} className="group relative p-4 rounded-lg bg-black/20 hover:bg-black/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-cyan-400">{problem.title}</h3>
              <Badge
                variant={
                  problem.difficulty === "Easy"
                    ? "default"
                    : problem.difficulty === "Medium"
                    ? "secondary"
                    : "destructive"
                }
              >
                {problem.difficulty}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mb-2">{problem.summary}</p>
            <Badge variant="outline" className="border-white/10">
              {Array.isArray(problem.category) ? problem.category[0] : 'General'}
            </Badge>
            <Link
              href={`/problems/${problem.id}`}
              className="absolute inset-0 flex items-center justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ArrowRight className="w-5 h-5 text-cyan-400" />
            </Link>
          </div>
        ))}
        {problems.length === 0 && (
          <p className="text-gray-400 text-center">No recommendations available</p>
        )}
      </div>
    </Card>
  );
}