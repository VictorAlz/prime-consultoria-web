import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Mail, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface PSSettings {
  active: boolean;
  form_url: string;
  description: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  linkedin_url: string | null;
  email: string | null;
  photo_url: string | null;
  display_order: number;
}

const Team = () => {
  const [psSettings, setPsSettings] = useState<PSSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);

  useEffect(() => {
    fetchPSSettings();
    fetchTeamMembers();
  }, []);

  const fetchPSSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "processo_seletivo")
        .single();

      if (error) throw error;
      if (data?.value) {
        setPsSettings(data.value as unknown as PSSettings);
      }
    } catch (error) {
      console.error("Error fetching PS settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setTeamLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground">Nosso Time</h1>
            <p className="text-lg md:text-xl text-primary-foreground/90">
              Conheça os profissionais excepcionais que tornam possível a transformação dos nossos clientes.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {teamLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-t-lg"></div>
                  <div className="p-6 space-y-4 bg-card rounded-b-lg border border-border">
                    <div className="h-6 bg-muted rounded w-2/3"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum membro da equipe cadastrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card
                  key={member.id}
                  className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300 card-hover animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Photo */}
                  <div className="aspect-square bg-gradient-to-br from-primary/20 via-accent/20 to-highlight/20 relative">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-4xl font-bold text-primary">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold">{member.name}</h3>
                      <p className="text-highlight font-medium">{member.role}</p>
                    </div>
                    {member.bio && <p className="text-muted-foreground">{member.bio}</p>}

                    {/* Social Links */}
                    <div className="flex space-x-3 pt-2">
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors flex items-center justify-center"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="h-5 w-5 text-primary" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors flex items-center justify-center"
                          aria-label="Email"
                        >
                          <Mail className="h-5 w-5 text-primary" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold">Junte-se ao Nosso Time</h2>
            
            {loading ? (
              <div className="animate-pulse h-20 bg-muted rounded-lg"></div>
            ) : psSettings?.active ? (
              <>
                <p className="text-lg text-muted-foreground">
                  {psSettings.description || "Estamos com processo seletivo aberto! Se você é apaixonado por tecnologia e transformação, queremos conhecê-lo."}
                </p>
                <Button
                  className="btn-highlight rounded-full px-8 py-4 text-lg font-medium inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  onClick={() => window.open(psSettings.form_url, "_blank")}
                >
                  Ver Oportunidades
                  <ExternalLink className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <div className="bg-muted/50 border border-border rounded-xl p-6 inline-flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <AlertCircle className="h-6 w-6" />
                    <span className="text-lg font-medium">Processo Seletivo Fechado</span>
                  </div>
                  <p className="text-muted-foreground max-w-md">
                    {psSettings?.description || "Não há processo seletivo ativo no momento. Fique atento às nossas redes sociais para saber quando abriremos novas vagas!"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Team;
