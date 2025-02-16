"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CompleteButtonProps {
  problemId: string;
  problemTitle: string;
  difficulty: string;
  isCompleted?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function CompleteButton({ 
  problemId,
  problemTitle,
  difficulty,
  isCompleted = false,
  onComplete,
  className 
}: CompleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const handleComplete = async () => {
    if (completed || loading) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to mark problems as complete",
          variant: "destructive",
        });
        return;
      }

      // Insert completion record
      const { error: completionError } = await supabase
        .from('problem_completions')
        .insert([
          {
            problem_id: problemId,
            user_id: session.user.id,
            completed_at: new Date().toISOString(),
          }
        ]);

      if (completionError) {
        if (completionError.code === '23505') { // Unique violation
          toast({
            title: "Already completed",
            description: "You've already marked this problem as complete",
          });
          setCompleted(true);
        } else {
          throw completionError;
        }
        return;
      }

      // Update user_activities
      await supabase
        .from('user_activities')
        .insert([
          {
            user_id: session.user.id,
            problem_id: problemId,
            action: 'Solved',
            problem_title: problemTitle,
            difficulty: difficulty,
          }
        ]);

      setCompleted(true);
      onComplete?.();
      
      toast({
        title: "Success!",
        description: "Problem marked as complete",
      });
    } catch (error) {
      console.error('Error completing problem:', error);
      toast({
        title: "Error",
        description: "Failed to mark problem as complete",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={completed ? "default" : "outline"}
      size="sm"
      className={cn(
        "gap-2 transition-all",
        completed && "bg-green-500 hover:bg-green-600",
        className
      )}
      onClick={handleComplete}
      disabled={loading || completed}
    >
      {completed ? (
        <>
          <Check className="h-4 w-4" />
          Completed
        </>
      ) : (
        <>
          {loading ? "Marking as complete..." : "Mark as Complete"}
        </>
      )}
    </Button>
  );
}