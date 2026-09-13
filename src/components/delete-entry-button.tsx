"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteEntryButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function onDelete() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 4000);
      return;
    }
    setPending(true);
    const res = await fetch(`/api/entries/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setPending(false);
      alert("Failed to delete");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={onDelete}
      disabled={pending}
      className={`font-mono text-[0.7rem] uppercase tracking-[0.18em] transition-colors ${
        confirming
          ? "text-destructive"
          : "text-muted-foreground hover:text-destructive"
      }`}
    >
      {pending ? "Erasing···" : confirming ? "Tap again to confirm" : "Erase entry"}
    </button>
  );
}
