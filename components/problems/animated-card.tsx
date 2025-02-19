"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  glowColor?: string;
}

export function AnimatedCard({ 
  children, 
  className,
  glowColor = "rgba(0, 240, 255, 0.2)",
  ...props 
}: AnimatedCardProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-xl bg-black/20 backdrop-blur-xl border border-white/10",
        "hover:border-white/20 transition-all duration-300",
        "p-6 overflow-hidden group",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      style={{
        boxShadow: `0 0 20px ${glowColor}`,
      }}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      {children}
    </motion.div>
  );
}