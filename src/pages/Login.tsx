import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, NotebookTabs, Sprout, SunMedium } from "lucide-react";
import { login } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
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

      navigate("/");
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Não foi possivel entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="page-shell justify-center">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <Card variant="hero" className="relative overflow-hidden lg:min-h-[34rem]">
            <div className="ambient-orb -left-8 top-10 h-24 w-24 bg-white/18" />
            <div className="ambient-orb bottom-12 right-10 h-20 w-20 bg-secondary-fixed/22" />
            <div className="relative flex h-full flex-col justify-between gap-12">
              <div className="space-y-6">
                <img src="/logo.png" alt="Logo CicloCampo" className="h-24 w-auto drop-shadow-sm" />
                <div className="space-y-3">
                  <CardEyebrow className="text-on-primary/72">
                    The Living Ledger
                  </CardEyebrow>
                  <h1 className="font-display text-4xl md:text-5xl text-on-primary font-bold">
                    Uma interface feita para cultivar clareza em campo.
                  </h1>
                  <p className="max-w-xl text-base text-on-primary/82 md:text-lg">
                    O CicloCampo organiza a horta escolar como um registro vivo:
                    profissional, legivel sob sol forte e acolhedor para quem
                    ensina.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <MetricCard
                  icon={<Sprout className="h-4 w-4" />}
                  label="Cultivo"
                  value="Rastreavel"
                />
                <MetricCard
                  icon={<SunMedium className="h-4 w-4" />}
                  label="Contraste"
                  value="Externo"
                />
                <MetricCard
                  icon={<NotebookTabs className="h-4 w-4" />}
                  label="Registro"
                  value="Editorial"
                />
              </div>
            </div>
          </Card>

          <Card variant="interactive" className="mx-auto w-full max-w-xl flex flex-col gap-6">
            <div className="space-y-3">
              <CardEyebrow>Acesso do professor</CardEyebrow>
              <div className="space-y-2">
                <h2 className="font-display text-3xl font-bold text-on-surface">
                  Entrar no CicloCampo
                </h2>
                <p className="text-base text-on-surface-variant">
                  Use seu acesso institucional para acompanhar lotes, registrar observacoes e iniciar novos ciclos.
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <InputField
                label="Email institucional"
                type="email"
                placeholder="professor@escola.gov.br"
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
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white/10 px-4 py-4 backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-2 text-on-primary/82 mb-2">
        {icon}
        <span className="text-label text-on-primary/80">{label}</span>
      </div>
      <p className="font-display text-xl text-on-primary font-bold">{value}</p>
    </div>
  );
}
