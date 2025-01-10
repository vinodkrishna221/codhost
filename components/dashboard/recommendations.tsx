"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function DashboardRecommendations() {
  const recommendations = [
    {
      title: "Valid Parentheses",
      category: "Stacks",
      difficulty: "Easy",
      description: "Master stack operations with this fundamental problem.",
    },
    {
      title: "Binary Tree Traversal",
      category: "Trees",
      difficulty: "Medium",
      description: "Improve your understanding of tree algorithms.",
    },
  ];

  return (
    <Card className="p-6 bg-black/20 backdrop-blur-xl border border-white/10">
      <h2 className="text-xl font-bold mb-4">Recommended Problems</h2>
      <div className="grid gap-4">
        {recommendations.map((problem, index) => (
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
            <p className="text-sm text-gray-400 mb-2">{problem.description}</p>
            <Badge variant="outline" className="border-white/10">
              {problem.category}
            </Badge>
            <Link
              href={`/problems/${problem.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="absolute inset-0 flex items-center justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ArrowRight className="w-5 h-5 text-cyan-400" />
            </Link>
          </div>
        ))}
      </div>
    </Card>
  );
}