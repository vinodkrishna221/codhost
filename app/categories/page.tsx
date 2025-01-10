import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Code,
  Database,
  GitBranch,
  Hash,
  LineChart,
  Network,
  Repeat,
  Share2,
} from "lucide-react";

const categories = [
  {
    title: "Arrays and Strings",
    icon: <Code className="h-6 w-6" />,
    description:
      "Master fundamental data structures and string manipulation techniques.",
    problemCount: 45,
  },
  {
    title: "Linked Lists",
    icon: <Share2 className="h-6 w-6" />,
    description:
      "Learn to manipulate linked data structures and solve related problems.",
    problemCount: 25,
  },
  {
    title: "Trees and Graphs",
    icon: <GitBranch className="h-6 w-6" />,
    description:
      "Explore hierarchical and network-based data structures and algorithms.",
    problemCount: 35,
  },
  {
    title: "Dynamic Programming",
    icon: <Brain className="h-6 w-6" />,
    description:
      "Solve complex problems by breaking them down into simpler subproblems.",
    problemCount: 30,
  },
  {
    title: "Sorting and Searching",
    icon: <Database className="h-6 w-6" />,
    description:
      "Implement and understand various sorting and searching algorithms.",
    problemCount: 20,
  },
  {
    title: "Hash Tables",
    icon: <Hash className="h-6 w-6" />,
    description:
      "Learn to use hash tables to solve problems efficiently.",
    problemCount: 15,
  },
  {
    title: "Recursion",
    icon: <Repeat className="h-6 w-6" />,
    description:
      "Master recursive problem-solving techniques and patterns.",
    problemCount: 25,
  },
  {
    title: "System Design",
    icon: <Network className="h-6 w-6" />,
    description:
      "Learn to design scalable systems and understand architectural patterns.",
    problemCount: 10,
  },
  {
    title: "Greedy Algorithms",
    icon: <LineChart className="h-6 w-6" />,
    description:
      "Understand and implement greedy algorithms for optimization problems.",
    problemCount: 20,
  },
];

export default function CategoriesPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">Problem Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="animate-float-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Card className="p-6 bg-black/20 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all hover:shadow-lg group">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{category.title}</h3>
                  <Badge variant="secondary" className="mt-1 bg-white/10 text-white">
                    {category.problemCount} problems
                  </Badge>
                </div>
              </div>
              <p className="text-gray-400">
                {category.description}
              </p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}