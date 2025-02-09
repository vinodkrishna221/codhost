"use client";

import { Button } from "@/components/ui/button";
import { signInWithProvider } from "@/lib/supabase/auth";
import { useToast } from "@/hooks/use-toast";
import { Github } from "lucide-react";

export function SocialAuth() {
  const { toast } = useToast();

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    try {
      const { error } = await signInWithProvider(provider);
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        onClick={() => handleSocialSignIn('google')}
        className="w-full"
      >
        Google
      </Button>
      <Button
        variant="outline"
        onClick={() => handleSocialSignIn('github')}
        className="w-full"
      >
        <Github className="mr-2 h-4 w-4" />
        GitHub
      </Button>
    </div>
  );
}