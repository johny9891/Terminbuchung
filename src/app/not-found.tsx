import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="mb-2 text-sm font-medium text-primary">404</p>
      <h1 className="text-4xl font-bold tracking-tight">Seite nicht gefunden</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Diese Seite existiert nicht oder wurde verschoben.
      </p>
      <Link href="/" className="mt-6">
        <Button>Zur Startseite</Button>
      </Link>
    </div>
  );
}
