import { createRoot } from "react-dom/client";
import { createElement } from "react";
// @ts-expect-error - no types
import html2pdf from "html2pdf.js";
import { ContractPreview } from "@/components/contracts/ContractPreview";

interface ContractData {
  issue_date: string;
  client_name?: string | null;
  client_document?: string | null;
  client_address?: string | null;
  client_signature?: string | null;
}

export async function generateContractPdf(contract: ContractData, filename = "contrato.pdf") {
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-10000px";
  host.style.top = "0";
  document.body.appendChild(host);

  const root = createRoot(host);
  await new Promise<void>((resolve) => {
    root.render(
      createElement(ContractPreview, {
        issueDate: contract.issue_date,
        clientName: contract.client_name,
        clientDocument: contract.client_document,
        clientAddress: contract.client_address,
        clientSignature: contract.client_signature,
        forPrint: true,
      })
    );
    setTimeout(resolve, 250);
  });

  const node = host.firstElementChild as HTMLElement;

  await html2pdf()
    .set({
      margin: 0,
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    })
    .from(node)
    .save();

  root.unmount();
  host.remove();
}