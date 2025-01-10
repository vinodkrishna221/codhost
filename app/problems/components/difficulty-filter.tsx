"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Difficulty = "Easy" | "Medium" | "Hard" | null;

interface DifficultyFilterProps {
  value: Difficulty;
  onChange: (value: Difficulty) => void;
}

export function DifficultyFilter({ value, onChange }: DifficultyFilterProps) {
  return (
    <Select
      value={value || "all"}
      onValueChange={(val) => onChange(val === "all" ? null : val as Difficulty)}
    >
      <SelectTrigger className="w-full md:w-[180px]">
        <SelectValue placeholder="Difficulty" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Difficulties</SelectItem>
        <SelectItem value="Easy">Easy</SelectItem>
        <SelectItem value="Medium">Medium</SelectItem>
        <SelectItem value="Hard">Hard</SelectItem>
      </SelectContent>
    </Select>
  );
}