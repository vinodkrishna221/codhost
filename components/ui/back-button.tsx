"use client";

import { ChevronLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Don't show on homepage
  if (pathname === '/') return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "fixed top-4 left-4 z-50",
        "bg-black/20 backdrop-blur-lg border border-white/10",
        "hover:bg-white/10 transition-all duration-200",
        "text-white/70 hover:text-white"
      )}
      onClick={() => router.back()}
      aria-label="Go back"
    >
      <ChevronLeft className="h-5 w-5" />
    </Button>
  );
}