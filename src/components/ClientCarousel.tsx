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
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Parceiros e Apoiadores
        </h2>

        {/* Carrossel Infinito */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {duplicatedClients.map((client, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 h-24 mx-4 flex items-center justify-center p-4"
              >
                <img
                  src={client.logo}
                  alt={`Logo ${client.name}`}
                  className="max-w-full max-h-full object-contain drop-shadow-md"
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
