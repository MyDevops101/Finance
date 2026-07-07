import Link from "next/link";
import type { Metadata } from "next";
import { Github, KeyRound } from "lucide-react";

import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Quiver Quantitative."
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader />
      <main className="mx-auto flex max-w-lg px-4 py-16 sm:px-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sign in to Quiver Quantitative</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/api/auth/signin/google">
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                Continue with Google
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/api/auth/signin/github">
                <Github className="h-4 w-4" aria-hidden="true" />
                Continue with GitHub
              </Link>
            </Button>
            <p className="pt-3 text-sm leading-6 text-muted">
              OAuth providers require `AUTH_GOOGLE_*` and `AUTH_GITHUB_*` values in the deployment environment.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
