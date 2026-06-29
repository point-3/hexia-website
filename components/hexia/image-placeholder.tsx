"use client"

import { ImageIcon } from "lucide-react"

export function ImagePlaceholder({ label }: { label?: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[var(--bg-muted)] px-4 text-center text-[var(--text-body)]">
      <div className="flex size-14 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-[var(--primary)] shadow-sm">
        <ImageIcon className="size-7" strokeWidth={1.7} />
      </div>
      {label ? (
        <span className="mt-3 line-clamp-2 text-xs font-medium leading-relaxed">
          {label}
        </span>
      ) : null}
    </div>
  )
}
