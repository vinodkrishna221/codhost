import { ParticleBackground } from "@/components/ui/particle-background";
import { GlowCard } from "@/components/ui/glow-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Code, GitBranch } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <ParticleBackground />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center p-4">
        <div className="container max-w-6xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
            Master Your Coding Journey
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Elevate your programming skills with our interactive learning platform.
            Join thousands of developers mastering code through immersive experiences.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600">
              Get Started
              <ArrowRight className="ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-cyan-500 text-cyan-500 hover:bg-cyan-950">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlowCard glowColor="rgba(0, 240, 255, 0.2)">
            <Code className="w-12 h-12 mb-4 text-cyan-400" />
            <h3 className="text-xl font-bold mb-2">Interactive Coding</h3>
            <p className="text-gray-400">
              Practice with real-time feedback and interactive code challenges.
            </p>
          </GlowCard>

          <GlowCard glowColor="rgba(176, 38, 255, 0.2)">
            <Brain className="w-12 h-12 mb-4 text-purple-400" />
            <h3 className="text-xl font-bold mb-2">AI-Powered Learning</h3>
            <p className="text-gray-400">
              Personalized learning paths adapted to your skill level.
            </p>
          </GlowCard>

          <GlowCard glowColor="rgba(255, 255, 255, 0.2)">
            <GitBranch className="w-12 h-12 mb-4 text-white" />
            <h3 className="text-xl font-bold mb-2">Project-Based</h3>
            <p className="text-gray-400">
              Build real-world projects to reinforce your learning.
            </p>
          </GlowCard>
        </div>
      </section>
    </div>
  );
}