import rioJuniorLogo from "@/assets/clients/rio-junior-logo.png";
import femassLogo from "@/assets/clients/femass-logo.png";
import prefeituraMacaeLogo from "@/assets/clients/prefeitura-macae-logo.png";
import petroleoVerdeLogo from "@/assets/clients/petroleo-verde-logo.png";

const ClientCarousel = () => {
  const clients = [
    { name: "Rio Junior", logo: rioJuniorLogo },
    { name: "FeMASS", logo: femassLogo },
    { name: "Prefeitura de Macaé", logo: prefeituraMacaeLogo },
    { name: "Petróleo Verde", logo: petroleoVerdeLogo },
  ];

  // Duplicar para efeito infinito
  const duplicatedClients = [...clients, ...clients];

  return (
    <section className="py-20 md:py-28 bg-background border-y border-border">
      <div className="container-custom">
        <div className="mb-14 md:mb-20 max-w-5xl">
          <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-highlight flex items-center gap-3 mb-6">
            <span className="inline-block h-px w-8 bg-highlight/60" />
            Confiam na CASE
          </div>
          <h2 className="font-serif uppercase text-foreground leading-[0.95] tracking-tight text-4xl md:text-6xl lg:text-7xl font-normal">
            Parceiros &<br />
            <em className="not-italic text-highlight">apoiadores</em>.
          </h2>
        </div>

        {/* Carrossel Infinito */}
        <div className="relative overflow-hidden border-t border-border pt-10">
          <div className="flex animate-scroll">
            {duplicatedClients.map((client, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 h-24 mx-8 flex items-center justify-center"
              >
                <img
                  src={client.logo}
                  alt={`Logo ${client.name}`}
                  className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-500"
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
