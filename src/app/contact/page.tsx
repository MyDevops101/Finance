import type { Metadata } from "next";
import { Mail, MessageSquare, Send } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the Eagle Quantitative team."
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Badge variant="accent">Contact</Badge>
          <h1 className="mt-5 text-4xl font-bold text-white">Talk to the team.</h1>
          <p className="mt-4 leading-7 text-muted">
            For enterprise access, data partnerships, research workflows, or product questions, send a note and the team will follow up.
          </p>
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
              research@Eaglequantitative.example
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <MessageSquare className="h-5 w-5 text-primary" aria-hidden="true" />
              Response target: one business day
            </div>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Send a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input placeholder="Name" aria-label="Name" />
              <Input type="email" placeholder="Email" aria-label="Email" />
              <Input placeholder="Company" aria-label="Company" />
              <textarea
                className="min-h-36 w-full rounded-lg border border-border bg-white/5 px-3 py-3 text-sm text-foreground outline-none placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="How can we help?"
                aria-label="Message"
              />
              <Button type="button">
                <Send className="h-4 w-4" aria-hidden="true" />
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <MarketingFooter />
    </div>
  );
}

