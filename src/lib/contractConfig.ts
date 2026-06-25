import signaturePresidente from "@/assets/signature-presidente.png";

export const COMPANY = {
  razaoSocial: "CASE EJ Consultoria",
  cnpj: "00.000.000/0001-00",
  endereco:
    "Rod. Amaral Peixoto, Km 164, Imboassica, Macaé - RJ, CEP 27925-310 (FeMass)",
  presidente: "Victor Hugo",
  diretorProjetos: "Victor Alves de Azevedo Aquino",
  cidade: "Macaé",
  uf: "RJ",
};

export const SIGNATURE_PRESIDENTE_SRC = signaturePresidente;

export const CONTRACT_TEMPLATE = {
  title: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CONSULTORIA EM TECNOLOGIA",
  clauses: [
    {
      heading: "CLÁUSULA 1ª — DAS PARTES",
      body: `Por este instrumento particular, de um lado {{company_name}}, inscrita no CNPJ sob o nº {{company_cnpj}}, com sede em {{company_address}}, doravante denominada CONTRATADA, e de outro lado {{client_name}}, inscrito(a) no CPF/CNPJ sob o nº {{client_document}}, residente/sediado(a) em {{client_address}}, doravante denominado(a) CONTRATANTE, têm entre si justo e contratado o presente Contrato de Prestação de Serviços, que se regerá pelas cláusulas e condições a seguir.`,
    },
    {
      heading: "CLÁUSULA 2ª — DO OBJETO",
      body: `O presente contrato tem por objeto a prestação, pela CONTRATADA, de serviços de consultoria, desenvolvimento de software, automações com inteligência artificial e/ou soluções digitais, conforme escopo previamente alinhado entre as partes em proposta comercial anexa, da qual o(a) CONTRATANTE declara ter ciência integral.`,
    },
    {
      heading: "CLÁUSULA 3ª — DAS OBRIGAÇÕES DA CONTRATADA",
      body: `A CONTRATADA obriga-se a executar os serviços com diligência, qualidade técnica e dentro dos prazos acordados na proposta, mantendo o(a) CONTRATANTE informado(a) sobre o andamento do projeto e atendendo às solicitações pertinentes ao escopo contratado.`,
    },
    {
      heading: "CLÁUSULA 4ª — DAS OBRIGAÇÕES DO(A) CONTRATANTE",
      body: `O(A) CONTRATANTE obriga-se a fornecer, em tempo hábil, todas as informações, materiais, acessos e validações necessárias à execução dos serviços, bem como a efetuar os pagamentos nos prazos e formas estabelecidos na proposta comercial.`,
    },
    {
      heading: "CLÁUSULA 5ª — DA REMUNERAÇÃO",
      body: `Pelos serviços prestados, o(a) CONTRATANTE pagará à CONTRATADA o valor total de {{contract_value}}, nas condições estabelecidas na proposta comercial anexa, que integra este contrato para todos os fins de direito.`,
    },
    {
      heading: "CLÁUSULA 6ª — DA CONFIDENCIALIDADE",
      body: `As partes obrigam-se a manter sigilo absoluto sobre todas as informações, técnicas, comerciais, estratégicas ou de qualquer outra natureza às quais venham a ter acesso em razão deste contrato, sob pena de responderem por perdas e danos.`,
    },
    {
      heading: "CLÁUSULA 7ª — DA VIGÊNCIA E RESCISÃO",
      body: `Este contrato vigorará pelo prazo previsto na proposta comercial e poderá ser rescindido por qualquer das partes, mediante notificação prévia de 30 (trinta) dias, ressalvadas as obrigações já assumidas.`,
    },
    {
      heading: "CLÁUSULA 8ª — DO FORO",
      body: `Fica eleito o foro da Comarca de Macaé, Estado do Rio de Janeiro, para dirimir quaisquer dúvidas ou controvérsias oriundas do presente contrato, com renúncia expressa a qualquer outro, por mais privilegiado que seja.`,
    },
  ],
};

export function formatDateExtenso(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date + "T00:00:00") : date;
  const meses = [
    "janeiro","fevereiro","março","abril","maio","junho",
    "julho","agosto","setembro","outubro","novembro","dezembro",
  ];
  return `${COMPANY.cidade}, ${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

export function maskCpfCnpj(value: string): string {
  const v = value.replace(/\D/g, "").slice(0, 14);
  if (v.length <= 11) {
    return v
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return v
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function formatBRL(value: number | null | undefined): string {
  if (value == null || isNaN(Number(value))) return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}