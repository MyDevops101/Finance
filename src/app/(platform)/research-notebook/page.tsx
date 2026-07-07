import type { Metadata } from "next";

import { QuantNotebook } from "@/components/features/quant-notebook";
import { SectionHeading } from "@/components/market/section-heading";

export const metadata: Metadata = {
  title: "Quant Research Notebook",
  description: "Interactive notebook for scanning the equity universe: momentum, value, quality, low-vol screens and summary statistics."
};

export default function ResearchNotebookPage() {
  return (
    <div>
      <SectionHeading
        eyebrow="Research"
        title="Quant Research Notebook"
        description="Add runnable cells to scan the live universe — momentum, value, quality, and low-vol screens plus summary statistics."
      />
      <QuantNotebook />
    </div>
  );
}
