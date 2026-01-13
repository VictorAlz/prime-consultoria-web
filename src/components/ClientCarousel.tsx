import techverdeLogo from "@/assets/clients/techverde-logo.png";
import novaImpactoLogo from "@/assets/clients/nova-impacto-logo.png";
import futuroSocialLogo from "@/assets/clients/futuro-social-logo.png";
import conectaBrasilLogo from "@/assets/clients/conecta-brasil-logo.png";
import horizonteDigitalLogo from "@/assets/clients/horizonte-digital-logo.png";
import redeSolidariaLogo from "@/assets/clients/rede-solidaria-logo.png";
import inovarLabsLogo from "@/assets/clients/inovar-labs-logo.png";
import ponteSocialLogo from "@/assets/clients/ponte-social-logo.png";

const ClientCarousel = () => {
  const clients = [
    { name: "TechVerde", logo: techverdeLogo },
    { name: "Nova Impacto", logo: novaImpactoLogo },
    { name: "Futuro Social", logo: futuroSocialLogo },
    { name: "Conecta Brasil", logo: conectaBrasilLogo },
    { name: "Horizonte Digital", logo: horizonteDigitalLogo },
    { name: "Rede Solidária", logo: redeSolidariaLogo },
    { name: "Inovar Labs", logo: inovarLabsLogo },
    { name: "Ponte Social", logo: ponteSocialLogo },
  ];

  // Duplicar para efeito infinito
  const duplicatedClients = [...clients, ...clients];

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Empresas que Confiam em Nós
        </h2>

        {/* Carrossel Infinito */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {duplicatedClients.map((client, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 h-24 mx-4 flex items-center justify-center bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
              >
                <img
                  src={client.logo}
                  alt={`Logo ${client.name}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientCarousel;
