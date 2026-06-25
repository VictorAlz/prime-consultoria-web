import { forwardRef } from "react";
import {
  COMPANY,
  CONTRACT_TEMPLATE,
  SIGNATURE_PRESIDENTE_SRC,
  formatDateExtenso,
} from "@/lib/contractConfig";

interface Props {
  issueDate: string;
  clientName?: string | null;
  clientDocument?: string | null;
  clientAddress?: string | null;
  clientSignature?: string | null;
  forPrint?: boolean;
}

const Placeholder = ({ value, label }: { value?: string | null; label: string }) =>
  value && value.trim() ? (
    <strong>{value}</strong>
  ) : (
    <span
      style={{
        background: "#fff7c2",
        padding: "0 4px",
        borderRadius: 2,
        color: "#7a5a00",
        fontStyle: "italic",
      }}
    >
      [{label}]
    </span>
  );

export const ContractPreview = forwardRef<HTMLDivElement, Props>(
  ({ issueDate, clientName, clientDocument, clientAddress, clientSignature, forPrint }, ref) => {
    const replaceVars = (text: string) => {
      const parts: (string | JSX.Element)[] = [];
      const regex = /\{\{(\w+)\}\}/g;
      let lastIdx = 0;
      let match: RegExpExecArray | null;
      let key = 0;
      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIdx) parts.push(text.slice(lastIdx, match.index));
        const v = match[1];
        if (v === "company_name") parts.push(<strong key={key++}>{COMPANY.razaoSocial}</strong>);
        else if (v === "company_cnpj") parts.push(<strong key={key++}>{COMPANY.cnpj}</strong>);
        else if (v === "company_address") parts.push(<strong key={key++}>{COMPANY.endereco}</strong>);
        else if (v === "client_name")
          parts.push(<Placeholder key={key++} value={clientName} label="NOME DO CLIENTE" />);
        else if (v === "client_document")
          parts.push(<Placeholder key={key++} value={clientDocument} label="CPF/CNPJ" />);
        else if (v === "client_address")
          parts.push(<Placeholder key={key++} value={clientAddress} label="ENDEREÇO COMPLETO" />);
        else parts.push(match[0]);
        lastIdx = match.index + match[0].length;
      }
      if (lastIdx < text.length) parts.push(text.slice(lastIdx));
      return parts;
    };

    return (
      <div
        ref={ref}
        className="contract-document"
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "25mm 22mm",
          background: "white",
          color: "#111",
          fontFamily: "'Times New Roman', Georgia, serif",
          fontSize: "12pt",
          lineHeight: 1.55,
          boxSizing: "border-box",
          margin: forPrint ? 0 : "0 auto",
          boxShadow: forPrint ? "none" : "0 4px 24px rgba(0,0,0,0.12)",
          textAlign: "justify",
        }}
      >
        <h1
          style={{
            fontSize: "14pt",
            textAlign: "center",
            textTransform: "uppercase",
            marginBottom: "12mm",
            letterSpacing: "0.5px",
          }}
        >
          {CONTRACT_TEMPLATE.title}
        </h1>

        {CONTRACT_TEMPLATE.clauses.map((c, i) => (
          <section
            key={i}
            style={{
              marginBottom: "6mm",
              pageBreakInside: "avoid",
              breakInside: "avoid",
            }}
          >
            <h2
              style={{
                fontSize: "12pt",
                fontWeight: 700,
                marginBottom: "2mm",
                pageBreakAfter: "avoid",
                breakAfter: "avoid",
              }}
            >
              {c.heading}
            </h2>
            <p style={{ margin: 0, textIndent: "10mm" }}>{replaceVars(c.body)}</p>
          </section>
        ))}

        <div
          style={{
            marginTop: "12mm",
            pageBreakInside: "avoid",
            breakInside: "avoid",
          }}
        >
          <p style={{ textAlign: "center", marginBottom: "10mm" }}>
            {formatDateExtenso(issueDate)}.
          </p>

          <div
            style={{
              display: "flex",
              gap: "10mm",
              justifyContent: "space-between",
              marginTop: "10mm",
            }}
          >
            <div style={{ flex: 1, textAlign: "center" }}>
              <img
                src={SIGNATURE_PRESIDENTE_SRC}
                alt="Assinatura do Presidente"
                style={{ height: "18mm", objectFit: "contain", marginBottom: "1mm" }}
              />
              <div style={{ borderTop: "1px solid #111", paddingTop: "2mm" }}>
                <strong>{COMPANY.presidente}</strong>
                <br />
                <small>{COMPANY.razaoSocial} — CONTRATADA</small>
              </div>
            </div>

            <div style={{ flex: 1, textAlign: "center" }}>
              {clientSignature ? (
                <img
                  src={clientSignature}
                  alt="Assinatura do Cliente"
                  style={{ height: "18mm", objectFit: "contain", marginBottom: "1mm" }}
                />
              ) : (
                <div style={{ height: "18mm", marginBottom: "1mm" }} />
              )}
              <div style={{ borderTop: "1px solid #111", paddingTop: "2mm" }}>
                <strong>
                  {clientName?.trim() ? clientName : "[CLIENTE]"}
                </strong>
                <br />
                <small>CONTRATANTE</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ContractPreview.displayName = "ContractPreview";