import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-[#080C14]">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-muted sm:px-6 md:grid-cols-4">
        <div>
          <div className="font-semibold text-white">Eagle Quantitative</div>
          <p className="mt-2 leading-6">Alternative data and quantitative intelligence for public market research.</p>
        </div>
        <Link href="/about" className="hover:text-white">About</Link>
        <Link href="/contact" className="hover:text-white">Contact</Link>
        <Link href="/api/market/overview" className="hover:text-white">API status</Link>
      </div>
    </footer>
  );
}

