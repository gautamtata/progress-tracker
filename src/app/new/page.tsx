import Link from "next/link";
import { NewEntryForm } from "@/components/new-entry-form";

export default function NewEntryPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 md:px-10 py-10 md:py-14">
      <div className="rise">
        <Link
          href="/"
          className="text-eyebrow text-muted-foreground hover:text-primary transition-colors"
        >
          ← Back
        </Link>
        <header className="mt-4 mb-10 border-b border-border/60 pb-6">
          <p className="text-eyebrow mb-3">A new entry</p>
          <h1 className="text-display text-5xl md:text-6xl">
            <span className="text-foreground">Re</span>
            <span className="text-primary">cord</span>
            <span className="text-foreground">.</span>
          </h1>
        </header>
      </div>
      <div className="rise grain-card rounded-lg border border-border/50 p-6 md:p-8" style={{ animationDelay: "0.08s" }}>
        <NewEntryForm />
      </div>
    </main>
  );
}
