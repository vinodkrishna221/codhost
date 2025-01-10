"use client";

import { Button } from "@/components/ui/button";
import { signInWithProvider } from "@/lib/supabase/auth";
import { useToast } from "@/hooks/use-toast";

export function SocialAuth() {
  const { toast } = useToast();

  const handleSocialSignIn = async (provider: 'google' | 'facebook') => {
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
        onClick={() => handleSocialSignIn('facebook')}
        className="w-full"
      >
        Facebook
      </Button>
    </div>
  );
}