"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setPending(false);
    if (!res.ok) {
      setError("That isn't it.");
      return;
    }
    router.replace(params.get("from") || "/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="password" className="text-eyebrow block">
          Pass phrase
        </label>
        <Input
          id="password"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 bg-transparent border-x-0 border-t-0 border-b-2 border-border rounded-none px-0 font-mono text-base focus-visible:border-primary focus-visible:ring-0"
        />
      </div>
      {error && (
        <p className="font-mono text-xs text-destructive uppercase tracking-[0.18em]">
          {error}
        </p>
      )}
      <Button
        type="submit"
        disabled={pending}
        className="w-full h-11 rounded-full font-mono text-xs uppercase tracking-[0.22em] accent-glow"
      >
        {pending ? "···" : "Enter"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-sm rise">
        <div className="text-center mb-10">
          <p className="text-eyebrow mb-4">A Personal Record</p>
          <h1 className="text-display text-6xl">
            <span className="text-foreground">Pro</span>
            <span className="text-primary">gress</span>
            <span className="text-foreground">.</span>
          </h1>
        </div>
        <div className="grain-card rounded-lg border border-border/50 p-7">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="text-eyebrow text-center mt-6 opacity-60">
          Kept privately, only by you.
        </p>
      </div>
    </div>
  );
}
