import type { Metadata } from "next";

import { FinancialStatements } from "@/components/features/financial-statements";
import { SectionHeading } from "@/components/market/section-heading";

export const metadata: Metadata = {
  title: "Financial Statements",
  description: "Income statement, balance sheet, and cash flow statements from Financial Modeling Prep."
};

export default function FinancialsPage() {
  return (
    <div>
      <SectionHeading
        eyebrow="Fundamentals"
        title="Financial Statements"
        description="Income statement, balance sheet, and cash flow — powered by Financial Modeling Prep (FMP)."
      />
      <FinancialStatements initialSymbol="AAPL" />
    </div>
  );
}
