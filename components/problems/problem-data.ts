export type ProgrammingLanguage = {
  id: string;
  name: string;
  icon: string;
};

export type Problem = {
  id: number | string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string[];
  detailedDescription: string;
  realWorldApplications: string[];
  supportedLanguages: string[];
  solution?: {
    Approach: string;
    timeComplexity: string;
    spaceComplexity: string;
  };
};


export const programmingLanguages: ProgrammingLanguage[] = [
  { id: "javascript", name: "JavaScript", icon: "js" },
  { id: "python", name: "Python", icon: "py" },
  { id: "java", name: "Java", icon: "java" },
  { id: "cpp", name: "C++", icon: "cpp" },
  { id: "typescript", name: "TypeScript", icon: "ts" },
  { id: "c", name: "C", icon: "c" }
];

export const problems: Problem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: ["Arrays", "Hash Tables"],
    description: "Find two numbers in an array that add up to a target sum.",
    detailedDescription: `Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    realWorldApplications: [
      "Financial transaction matching",
      "Shopping cart price combinations",
      "Resource allocation in scheduling systems"
    ],
    supportedLanguages: ["javascript", "python", "java", "cpp", "typescript", "c"]
  }
];
