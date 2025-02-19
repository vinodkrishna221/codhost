"use client";

import { Problem } from "@/components/problems/problem-data";
import { AnimatedCard } from "@/components/problems/animated-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CompleteButton } from "./complete-button";

interface ProblemCardProps {
  problem: Problem;
  index: number;
  isCompleted?: boolean;
  onComplete?: () => void;
}

export function ProblemCard({ 
  problem, 
  index,
  isCompleted = false,
  onComplete 
}: ProblemCardProps) {
  return (
    <div 
      className="animate-float-up"
      style={{ 
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <AnimatedCard>
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-white">{problem.title}</h3>
          <div className="flex items-center gap-2">
            <CompleteButton 
              problemId={problem.id.toString()}
              isCompleted={isCompleted}
              onComplete={onComplete}
            />
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
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {problem.category && problem.category.map((cat, index) => (
            <Badge key={index} variant="outline" className="border-white/10">
              {cat}
            </Badge>
          ))}
        </div>
        <p className="mt-4 text-gray-400">{problem.description}</p>
        <Button
          variant="link"
          className="mt-4 p-0 text-cyan-400 hover:text-cyan-300"
          asChild
        >
          <Link href={`/problems/${problem.id}`}>
            View Problem
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </AnimatedCard>
    </div>
  );
}