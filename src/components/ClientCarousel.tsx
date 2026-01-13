const ClientCarousel = () => {
  // Array de empresas parceiras fictícias
  const clients = [
    "Nestlé",
    "Sebrae",
    "Brasil Júnior",
    "UFMG",
    "Senac",
    "Prefeitura de BH",
    "Instituto Ayrton Senna",
    "Fundação Bradesco",
    "Ambev",
    "Vale",
    // Duplicados para efeito infinito
    "Nestlé",
    "Sebrae",
    "Brasil Júnior",
    "UFMG",
    "Senac",
    "Prefeitura de BH",
    "Instituto Ayrton Senna",
    "Fundação Bradesco",
    "Ambev",
    "Vale",
  ];

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Empresas que Confiam em Nós
        </h2>

        {/* Carrossel Infinito */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {clients.map((client, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 h-24 mx-4 flex items-center justify-center bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-lg font-semibold text-muted-foreground">
                  {client}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradientes nas bordas para efeito de fade */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-muted/30 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-muted/30 to-transparent pointer-events-none"></div>
      </div>
    </section>
  );
};

export default ClientCarousel;
