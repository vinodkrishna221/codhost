"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Problem, programmingLanguages } from "./problem-data";
import { Clock, HardDrive, Lightbulb } from "lucide-react";

interface ProblemDialogProps {
  problem: Problem;
  isOpen: boolean;
  onClose: () => void;
}

export function ProblemDialog({ problem, isOpen, onClose }: ProblemDialogProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(problem.supportedLanguages[0]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-black/90 border-white/10">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">{problem.title}</DialogTitle>
            <div className="flex gap-2">
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
            {problem.category.map((cat, index) => (
              <Badge key={index} variant="outline" className="border-white/10">
                {cat}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <Tabs defaultValue="description" className="mt-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/50">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="approach">Approach</TabsTrigger>
            <TabsTrigger value="solution">Solution</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-4">
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 text-white">Problem Description</h3>
              <p className="text-gray-300">{problem.detailedDescription}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-white">Real-World Applications</h3>
              <ul className="list-disc pl-5 space-y-2">
                {problem.realWorldApplications.map((application, index) => (
                  <li key={index} className="text-gray-300">
                    {application}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="approach">
            <Card className="p-4 bg-black/20 border-white/10">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-cyan-400" />
                    <h3 className="text-lg font-semibold text-white">Solution Approach</h3>
                  </div>
                  <p className="text-gray-300">{problem.solutionApproach}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-cyan-400" />
                    <h3 className="text-lg font-semibold text-white">Time Complexity</h3>
                  </div>
                  <p className="text-gray-300">{problem.timeComplexity}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="h-5 w-5 text-cyan-400" />
                    <h3 className="text-lg font-semibold text-white">Space Complexity</h3>
                  </div>
                  <p className="text-gray-300">{problem.spaceComplexity}</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="solution">
            <div className="space-y-4">
              <div className="flex gap-2">
                {problem.supportedLanguages.map((lang) => {
                  const language = programmingLanguages.find((l) => l.id === lang);
                  return (
                    <Badge
                      key={lang}
                      variant={selectedLanguage === lang ? "default" : "outline"}
                      className="cursor-pointer border-white/10"
                      onClick={() => setSelectedLanguage(lang)}
                    >
                      {language?.name}
                    </Badge>
                  );
                })}
              </div>
              <Card className="p-4 bg-black/20 border-white/10">
                <pre className="text-sm overflow-x-auto text-gray-300">
                  <code>
                    {`// Solution will be implemented based on selected language: ${
                      programmingLanguages.find((l) => l.id === selectedLanguage)?.name
                    }`}
                  </code>
                </pre>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}