"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Images, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { localInputToUTC, nowLocalInputValue } from "@/lib/time";

type Pose = "front" | "back" | "leftSide" | "rightSide";
const POSES: Pose[] = ["front", "back", "leftSide", "rightSide"];
const POSE_LABEL: Record<Pose, string> = {
  front: "Front",
  back: "Back",
  leftSide: "Left side",
  rightSide: "Right side",
};

export function NewEntryForm() {
  const router = useRouter();
  const [takenAt, setTakenAt] = useState(nowLocalInputValue());
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"lbs" | "kg">("lbs");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<Record<Pose, File | null>>({
    front: null,
    back: null,
    leftSide: null,
    rightSide: null,
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadOne(pose: Pose, file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("pose", pose);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error(`upload failed for ${pose}`);
    const { url } = await res.json();
    return url;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const w = parseFloat(weight);
    if (!Number.isFinite(w) || w <= 0) {
      setError("Enter a valid weight");
      return;
    }
    setPending(true);
    try {
      const urls: Partial<Record<Pose, string>> = {};
      for (const pose of POSES) {
        const f = files[pose];
        if (f) urls[pose] = await uploadOne(pose, f);
      }
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          takenAt: localInputToUTC(takenAt).toISOString(),
          weight: w,
          unit,
          notes: notes || null,
          frontUrl: urls.front ?? null,
          backUrl: urls.back ?? null,
          leftSideUrl: urls.leftSide ?? null,
          rightSideUrl: urls.rightSide ?? null,
        }),
      });
      if (!res.ok) throw new Error("save failed");
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "something broke");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <Field label="Date & time · Pacific">
        <Input
          id="takenAt"
          type="datetime-local"
          value={takenAt}
          onChange={(e) => setTakenAt(e.target.value)}
          required
          className="bare-input"
        />
      </Field>

      <div className="grid grid-cols-[1fr_7rem] gap-4 items-end">
        <Field label="Weight">
          <div className="relative">
            <input
              id="weight"
              type="number"
              step="0.1"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              placeholder="0.0"
              className="text-display text-6xl md:text-7xl text-foreground w-full bg-transparent border-0 border-b-2 border-border focus:border-primary focus:outline-none px-0 py-2 placeholder:text-border"
            />
          </div>
        </Field>
        <div className="flex gap-1 mb-3">
          {(["lbs", "kg"] as const).map((u) => (
            <button
              type="button"
              key={u}
              onClick={() => setUnit(u)}
              className={`flex-1 h-9 rounded-full font-mono text-[0.7rem] uppercase tracking-[0.18em] transition-all ${
                unit === u
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-eyebrow mb-4">Photographs · Optional</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {POSES.map((pose) => (
            <PhotoSlot
              key={pose}
              pose={pose}
              label={POSE_LABEL[pose]}
              file={files[pose]}
              onChange={(f) => setFiles((s) => ({ ...s, [pose]: f }))}
            />
          ))}
        </div>
      </div>

      <Field label="Notes">
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="A line for the journal…"
          className="bare-input resize-none font-sans"
        />
      </Field>

      {error && (
        <p className="font-mono text-xs text-destructive uppercase tracking-[0.18em]">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={pending}
          className="h-11 px-8 rounded-full font-mono text-xs uppercase tracking-[0.22em] accent-glow"
        >
          {pending ? "Saving···" : "Commit entry"}
        </Button>
        <button
          type="button"
          onClick={() => router.push("/")}
          disabled={pending}
          className="text-eyebrow text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>

      <style>{`
        .bare-input {
          background: transparent !important;
          border: 0 !important;
          border-bottom: 2px solid var(--border) !important;
          border-radius: 0 !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
          font-family: var(--font-jetbrains) !important;
        }
        .bare-input:focus, .bare-input:focus-visible {
          border-bottom-color: var(--primary) !important;
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-eyebrow">{label}</p>
      {children}
    </div>
  );
}

function PhotoSlot({
  pose,
  label,
  file,
  onChange,
}: {
  pose: Pose;
  label: string;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    // reset so choosing the same file again still fires onChange
    e.target.value = "";
    if (f) onChange(f);
  }

  function clear() {
    onChange(null);
    if (cameraRef.current) cameraRef.current.value = "";
    if (libraryRef.current) libraryRef.current.value = "";
  }

  return (
    <div
      className={`group relative aspect-[3/4] rounded-md border-2 border-dashed overflow-hidden transition-all ${
        file
          ? "border-primary/60"
          : "border-border hover:border-primary/40 hover:bg-foreground/[0.02]"
      }`}
    >
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={pick}
        className="hidden"
        aria-label={`${label} — take photo`}
      />
      <input
        ref={libraryRef}
        type="file"
        accept="image/*"
        onChange={pick}
        className="hidden"
        aria-label={`${label} — choose from library`}
      />

      {preview && (
        <img
          src={preview}
          alt={label}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <div
        className={`absolute inset-0 flex flex-col p-2.5 ${
          preview ? "bg-gradient-to-t from-background/80 via-transparent to-transparent" : ""
        }`}
      >
        <div className="flex items-start justify-between">
          <span className="text-eyebrow text-[0.6rem]">{label}</span>
          {preview && (
            <button
              type="button"
              onClick={clear}
              aria-label={`Remove ${label} photo`}
              className="-mt-1 -mr-1 h-7 w-7 rounded-full bg-background/80 backdrop-blur border border-border text-foreground flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {!preview && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              className="flex items-center gap-1.5 h-8 px-3 rounded-full border border-border font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors"
            >
              <Camera className="h-3.5 w-3.5" />
              Camera
            </button>
            <button
              type="button"
              onClick={() => libraryRef.current?.click()}
              className="flex items-center gap-1.5 h-8 px-3 rounded-full border border-border font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors"
            >
              <Images className="h-3.5 w-3.5" />
              Library
            </button>
          </div>
        )}

        {preview && (
          <button
            type="button"
            onClick={() => libraryRef.current?.click()}
            className="mt-auto self-end font-mono text-[0.6rem] uppercase tracking-[0.18em] text-foreground/80 hover:text-foreground"
          >
            Replace
          </button>
        )}
      </div>
    </div>
  );
}
