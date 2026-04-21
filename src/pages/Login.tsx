import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, NotebookTabs, Sprout, SunMedium } from "lucide-react";
import { login } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { queryClient } from "../lib/queryClient";
import { useUserStore } from "../store/useUserStore";
import { Button, Card, CardEyebrow, InputField } from "../components/ui";

export function Login() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await login(email, password);
      const userId = data.user.id;

      const { data: profile } = await supabase
        .from("profiles")
        .select("school_id, role")
        .eq("id", userId)
        .single();

      if (profile) {
        setUser({
          userId,
          schoolId: profile.school_id,
          role: profile.role ?? "teacher",
        });
      }

      queryClient.clear();
      navigate("/");
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Não foi possivel entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-xl">
        <Card
            variant="interactive"
            className="mx-auto w-full max-w-xl flex flex-col gap-6"
          >
            <div className="space-y-3">
              <CardEyebrow>Acesso do professor</CardEyebrow>
              <div className="space-y-2">
                <h2 className="font-display text-3xl font-bold text-on-surface">
                  Entrar no CicloCampo
                </h2>
                <p className="text-base text-on-surface-variant">
                  Use seu acesso institucional para acompanhar lotes, registrar
                  observacoes e iniciar novos ciclos.
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <InputField
                label="Email institucional"
                type="email"
                placeholder="professor@escola.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <InputField
                label="Senha"
                type="password"
                placeholder="Digite sua senha"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <div className="rounded-xl bg-secondary-container px-4 py-3 text-sm font-medium text-on-secondary-container">
                  {error}
                </div>
              )}

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? "Entrando..." : "Entrar no painel"}
                <ArrowRight className="h-4 w-4 ml-2 inline" />
              </Button>

              <div className="mt-2 text-center">
                <button
                  type="button"
                  className="inline-flex items-center text-sm font-semibold text-primary underline decoration-secondary-fixed/50 decoration-[0.2rem] underline-offset-[0.25rem] hover:decoration-secondary-fixed transition-colors"
                >
                  Precisa recuperar o acesso?
                </button>
              </div>
            </form>
          </Card>
      </div>
    </div>
  );
}
