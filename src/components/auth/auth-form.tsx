"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Github, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = React.useMemo(() => createClient(), []);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const redirectTo = params.get("redirectTo") || "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        toast.success("Konto erstellt! Bitte E-Mail bestätigen.");
        router.push("/login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Willkommen zurück!");
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Etwas ist schiefgegangen";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider: "google" | "github") {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) toast.error(error.message);
  }

  const isRegister = mode === "register";

  return (
    <Card className="border-border/60 shadow-xl shadow-purple-500/5">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {isRegister ? "Konto erstellen" : "Willkommen zurück"}
        </CardTitle>
        <CardDescription>
          {isRegister
            ? "Starte kostenlos. Keine Kreditkarte erforderlich."
            : "Melde dich an, um auf dein Dashboard zuzugreifen."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => handleOAuth("google")} type="button">
            <Mail className="h-4 w-4" /> Google
          </Button>
          <Button variant="outline" onClick={() => handleOAuth("github")} type="button">
            <Github className="h-4 w-4" /> GitHub
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">oder mit E-Mail</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (
            <div>
              <label className="mb-1.5 block text-sm font-medium">Name</label>
              <Input
                type="text"
                placeholder="Max Mustermann"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium">E-Mail</label>
            <Input
              type="email"
              placeholder="du@beispiel.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Passwort</label>
            <Input
              type="password"
              placeholder="Mindestens 8 Zeichen"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </div>
          <Button type="submit" className="w-full" loading={loading}>
            {isRegister ? "Konto erstellen" : "Anmelden"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isRegister ? (
            <>
              Schon registriert?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Anmelden
              </Link>
            </>
          ) : (
            <>
              Noch kein Konto?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Jetzt erstellen
              </Link>
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
