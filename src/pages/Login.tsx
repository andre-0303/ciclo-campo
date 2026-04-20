// src/pages/Login.tsx
import { useState } from "react";
import { login } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useUserStore } from "../store/useUserStore";

export function Login() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await login(email, password);
      const userId = data.user.id;

      // Busca o profile ANTES de navegar
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm"
      >
        <img src="/logo.png" alt="logo" className="h-48 mx-auto" />
        <h1 className="text-xl font-bold mb-2">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-center text-xs mt-6 text-green-600">
          <a href="#">Esqueceu a Senha? Clique aqui!</a>
        </p>
      </form>
    </div>
  );
}
