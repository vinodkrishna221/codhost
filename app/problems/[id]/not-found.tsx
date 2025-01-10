import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container py-8 max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">Problem Not Found</h2>
      <p className="text-gray-400 mb-8">The problem you're looking for doesn't exist.</p>
      <Button asChild>
        <Link href="/problems">Back to Problems</Link>
      </Button>
    </div>
  );
}