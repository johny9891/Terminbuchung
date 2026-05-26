"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { FileUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatBytes } from "@/lib/utils/format";
import { PLAN_LIMITS, type Plan } from "@/types";

const ACCEPTED = {
  "application/pdf": [".pdf"],
  "text/plain": [".txt"],
  "text/markdown": [".md"],
};

export function UploadZone({ plan = "free" }: { plan?: Plan }) {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
  const limit = PLAN_LIMITS[plan];

  const onDrop = React.useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      if (file.size > limit.maxFileMb * 1024 * 1024) {
        toast.error(`Datei zu groß. Limit: ${limit.maxFileMb} MB`);
        return;
      }

      setUploading(true);
      const form = new FormData();
      form.append("file", file);

      try {
        const res = await fetch("/api/documents/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload fehlgeschlagen");
        toast.success("Dokument hochgeladen — KI verarbeitet …");
        router.push(`/documents/${data.id}`);
        router.refresh();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Upload fehlgeschlagen");
      } finally {
        setUploading(false);
      }
    },
    [limit.maxFileMb, router],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    multiple: false,
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "group cursor-pointer rounded-2xl border-2 border-dashed border-border bg-card/30 p-10 text-center transition-all hover:border-primary/50 hover:bg-primary/5",
        isDragActive && "border-primary bg-primary/10",
        uploading && "pointer-events-none opacity-60",
      )}
    >
      <input {...getInputProps()} />
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
        {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <FileUp className="h-6 w-6" />}
      </div>
      <h3 className="mb-1 font-semibold">
        {uploading ? "Wird hochgeladen …" : "PDF oder Textdatei hierhin ziehen"}
      </h3>
      <p className="text-sm text-muted-foreground">
        Oder klicke zum Auswählen · Max {limit.maxFileMb} MB ·{" "}
        {formatBytes(limit.maxFileMb * 1024 * 1024, 0)} pro Datei
      </p>
    </div>
  );
}
