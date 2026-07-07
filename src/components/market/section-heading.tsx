import { Badge } from "@/components/ui/badge";

export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4 border-b border-border pb-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            {eyebrow ? <Badge variant="default">{eyebrow}</Badge> : null}
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted">&lt;GO&gt;</span>
          </div>
          <h1 className="mt-2 text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">{title}</h1>
          {description ? (
            <p className="mt-1.5 max-w-3xl text-xs leading-5 text-muted">{description}</p>
          ) : null}
        </div>
        <div className="hidden items-center gap-2 text-[10px] uppercase tracking-wider text-muted sm:flex">
          <span className="term-blink text-success">● live</span>
          <span className="text-primary">Eagle Terminal</span>
        </div>
      </div>
    </div>
  );
}
