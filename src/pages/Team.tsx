import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Mail } from "lucide-react";

const Team = () => {
  const teamMembers = [
    {
      name: "Ryan",
      role: "Diretor Presidente",
      bio: "",
    },
    {
      name: "Victor",
      role: "Diretor de Projetos",
      bio: "",
    },
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300 card-hover animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Photo Placeholder */}
                <div className="aspect-square bg-gradient-to-br from-primary/20 via-accent/20 to-highlight/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">{member.name}</h3>
                    <p className="text-highlight font-medium">{member.role}</p>
                  </div>
                  <p className="text-muted-foreground">{member.bio}</p>

                  {/* Social Links */}
                  <div className="flex space-x-3 pt-2">
                    <button
                      className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors flex items-center justify-center"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5 text-primary" />
                    </button>
                    <button
                      className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors flex items-center justify-center"
                      aria-label="Email"
                    >
                      <Mail className="h-5 w-5 text-primary" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold">Junte-se ao Nosso Time</h2>
            <p className="text-lg text-muted-foreground">
              Estamos sempre em busca de talentos excepcionais. Se você é apaixonado por estratégia e transformação,
              queremos conhecê-lo.
            </p>
            <button className="btn-highlight rounded-full px-8 py-4 text-lg font-medium inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
              Ver Oportunidades
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Team;
