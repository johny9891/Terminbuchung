import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2 font-semibold", className)}>
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white shadow-md shadow-purple-500/30">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path
            d="M4 4h10l6 6v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M14 4v6h6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="12" cy="15" r="2.2" fill="currentColor" />
        </svg>
      </div>
      <span className="text-base tracking-tight">
        Docu<span className="gradient-text">AI</span>
      </span>
    </Link>
  );
}
