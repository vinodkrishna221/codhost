"use client";

import Link from "next/link";
import { SignUpForm } from "@/components/auth/signup-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SocialAuth } from "@/components/auth/social-auth";

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <p className="text-sm text-gray-400">
          Sign up to get started with CodeMaster
        </p>
      </div>

      <SignUpForm />
      
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <SocialAuth />
      </div>

      <div className="text-center text-sm">
        <span className="text-gray-400">Already have an account? </span>
        <Button variant="link" className="p-0" asChild>
          <Link href="/auth/signin">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}