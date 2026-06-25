import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ShieldCheck, FileSignature, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";

const Contratos = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
        return;
      }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative"
      style={{
        background:
          "linear-gradient(135deg, hsl(268 35% 85%) 0%, hsl(240 100% 99%) 50%, hsl(194 87% 90%) 100%)",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>

      <div className="w-full max-w-3xl flex flex-col items-center text-center">
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-10">
          <img src={logo} alt="CASE" className="h-24 w-24 object-contain" />
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, hsl(268 48% 29%), hsl(194 87% 60%), hsl(268 48% 20%))",
            }}
          >
            CASE
          </span>
          <span className="text-foreground"> — Contrato Digital</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
          Plataforma de criação, envio e assinatura digital de contratos —
          rápida, segura e descomplicada.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            onClick={() => navigate("/contratos/admin")}
            className="h-14 px-8 text-base font-semibold text-white shadow-lg hover:opacity-95"
            style={{
              backgroundImage:
                "linear-gradient(90deg, hsl(347 62% 58%), hsl(268 48% 40%))",
            }}
          >
            <ShieldCheck className="h-5 w-5 mr-2" />
            Acessar Admin
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-8 text-base font-semibold bg-card/80 backdrop-blur"
          >
            <FileSignature className="h-5 w-5 mr-2" />
            Como funciona
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Contratos;